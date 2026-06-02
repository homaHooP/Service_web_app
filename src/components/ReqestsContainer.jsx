import { useAuth } from "../hooks/AuthContext.jsx";
import { useState, useEffect } from "react";
import { getRequests, getMyRequests } from "../api/requestApi.js";
import { useNavigate } from "react-router-dom";
import Modal from "../components/addRequestModal.jsx";

function Container() {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchRequests() {
            try {
                let response;

                if (user.role === "operator") {
                    response = await getRequests();
                } else {
                    response = await getMyRequests();
                }

                setRequests(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        if (user) {
            fetchRequests();
        }
    }, [user]);

    function openRequestPage(id) {
        setIsModalOpen(false);
        navigate(`/requests/${id}`);
    }

    return (
        <div className="requests-container">
            {requests.length > 0 ? requests.map((req) => (
                <div className="request" onClick={()=>{openRequestPage(req.id)}} key={req.id}>
                    <div className="request-upper">
                        <p className="request-user">{req.user}</p>
                        <p className={`request-priority ${req.priority}`}>{req.priority}</p>
                    </div>
                    <h2 className="request-title">{req.title}</h2>
                    <p className="request-description">{req.desc}</p>
                    <p className="request-category">{req.category}</p>
                    <p className="request-status">{req.status}</p>
                </div>
                )) :<p className="request-empty">Nothing here</p>
            }
            {user.role === "client" && <button className="floating-btn" onClick={() => setIsModalOpen(true)}>+</button>}
            {isModalOpen && (<Modal setIsModalOpen={setIsModalOpen} setRequests = {setRequests} />)}
        </div>
    )
}

export default Container;