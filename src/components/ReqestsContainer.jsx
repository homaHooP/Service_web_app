import { useAuth } from "../hooks/AuthContext.jsx";
import { useState, useEffect } from "react";
import { getRequests, getMyRequests } from "../api/requestApi.js";
import { useNavigate } from "react-router-dom";
import Modal from "../components/addRequestModal.jsx";

function Container() {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [filters, setFilters] = useState({title: "", category: "", status: "", priority: ""});
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

    const categories = [...new Set(requests.map(req => req.category))];
    const filteredRequests = requests.filter(req => {

        const matchesTitle = req.title.toLowerCase().includes(filters.title.toLowerCase());

        const matchesCategory =
            filters.category === "" ||
            req.category === filters.category;
        const matchesStatus =
            filters.status === "" ||
            req.status === filters.status;
        const matchesPriority =
            filters.priority === "" ||
            req.priority === filters.priority;

        return (
            matchesTitle &&
            matchesCategory &&
            matchesStatus &&
            matchesPriority
        );
    });

    return (
        <div className="all-cont">
            <div className="filters">
                <input className="filter-input" value={filters.title} onChange={(e)=> setFilters((prev)=> ({...prev, title: e.target.value}))} type="text" placeholder="Search by title..."/>
                <select value={filters.category} onChange={(e)=> setFilters((prev)=>({...prev, category: e.target.value}))}>
                    <option value="">All categories</option>
                    {categories.map((category,index) => (
                        <option key={index} value={category}>{category}</option>
                    ))}
                </select>
                <select value={filters.status} onChange={(e)=> setFilters((prev)=>({...prev, status: e.target.value}))}>
                    <option value="">Every status</option>
                    <option value="unresolved">Unresolved</option>
                    <option value="in progress">In progress</option>
                    <option value="completed">Completed</option>
                </select>
                <select value={filters.priority} onChange={(e)=> setFilters((prev)=>({...prev, priority: e.target.value}))}>
                    <option value="">Every priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <button
                    className="clear-filters-btn"
                    onClick={() =>
                        setFilters({
                            title: "",
                            category: "",
                            status: "",
                            priority: ""
                        })}>
                    Reset filters
                </button>
            </div>
            <div className="requests-container">
                {filteredRequests.length > 0 ? filteredRequests.map((req) => (
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
        </div>
    )
}

export default Container;