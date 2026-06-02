import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getRequest,deleteRequestHistory,updateRequestHistory,updateRequestComments,updateRequestStatus } from "../api/requestApi.js";
import { useAuth } from "../hooks/AuthContext.jsx";

function Request(){
    const {id} = useParams();
    const [request, setRequest] = useState({});
    const [error, setError] = useState("");
    const {user} = useAuth();

    useEffect(()=>{
        async function fetchRequest(){
            try{
                let req = await getRequest(id);
                setRequest(req.data);
            }
            catch(err){
                setError(err.message);
            }
        }
        fetchRequest();
    },[id]);

    function Error(){
        return(
            <div className="error-box">{error}</div>
        )
    }

    function Contains() {
        const [comment, setComment] = useState("");
        const [cerror, setCerror] = useState("");
        const [historyStep, setHistoryStep] = useState("");
        const [herror, setHerror] = useState("");
        const [aboutToDel, setAboutToDel] = useState(null);

        async function onComment(){
            setCerror("");
            if(comment.trim() === ""){
                setCerror("Comment cannot be empty");
                return;
            }
            if(comment.trim().length <= 4){
                setCerror("Comment cannot be less than 4 characters");
                return;
            }
            if(comment.trim().length >= 200){
                setCerror("Comment cannot be more than 200 characters");
                return;
            }

            try{
                let resp = await updateRequestComments(request.id,comment);
                setRequest(prev => ({
                    ...prev,
                    comments: resp.data
                }));
            }
            catch(err){
                setError(err.message);
            }
        }
        async function onHistroyChange(){
            setHerror("");
            if(historyStep.trim() === ""){
                setHerror("Field cannot be empty");
                return;
            }
            if(historyStep.trim().length <= 4){
                setHerror("Field cannot be less than 4 characters");
                return;
            }
            if(historyStep.trim().length >= 200){
                setHerror("Field cannot be more than 200 characters");
                return;
            }

            try{
                let resp = await updateRequestHistory(request.id,historyStep);
                setRequest(prev => ({
                    ...prev,
                    history: resp.data
                }));
            }
            catch(err){
                setError(err.message);
            }
        }

        async function delHistoryStep(index){
            if (index === 0 || user.role !== "operator" || user.id !== request.operatorId || request.status === "completed"){
                return;
            }
            try{
                let resp = await deleteRequestHistory(request.id,index);
                setRequest(prev => ({
                    ...prev,
                    history: resp.data
                }));
                setAboutToDel(null);
            }
            catch(err){
                setError(err.message);
            }
        }

        async function takeRequest(){
            if (request.operatorId !== 0 || request.status !== "unresolved"){
                setError("The request is already taken");
                return;
            }
            try{
                let resp = await updateRequestStatus(request.id,{op : user.id, status : "in progress"});
                setRequest(prev => ({
                    ...prev,
                    operatorId : resp.data[0],
                    status: resp.data[1],
                    history: resp.data[2]
                }));
            }catch(err){
                setError(err.message)
            }
        }

        async function completeRequest(){
            if (request.operatorId === 0 || request.status !== "in progress"){
                setError("The request is already taken");
                return;
            }
            else if (user.id !== request.operatorId){
                setError("Access denied");
                return;
            }
            try{
                let resp = await updateRequestStatus(request.id,{op : user.id, status : "completed"});
                setRequest(prev => ({
                    ...prev,
                    operatorId : resp.data[0],
                    status: resp.data[1],
                    history: resp.data[2]
                }));
            }catch(err){
                setError(err.message)
            }
        }

        return (
            <div className="request-page">
                <div className="request-page-top">
                    <div className="request-page-main">
                        <div className="request-page-header">
                            <div>
                                <p className="request-page-user">{request.user}</p>
                                <h1 className="request-page-title">{request.title}</h1>
                            </div>
                            <span className={`request-priority ${request.priority}`}>{request.priority}</span>
                        </div>

                        <div className="request-page-meta">
                            <span>{request.category}</span>
                            <span>{request.status}</span>
                        </div>

                        <p className="request-page-description">{request.desc}</p>
                        {user?.role === "operator" &&
                            <div className="request-page-buttons">
                                {request.operatorId === 0 && <button onClick={takeRequest} className="request-page-button take-btn">Take the request</button>}
                                {request.operatorId === user.id && request.status !== "completed" && <button onClick={completeRequest} className="request-page-button complete-btn">Mark as completed</button>}
                            </div>
                        }
                    </div>
                    <div className="request-page-history">
                        <h2>History</h2>
                        {request.history?.length > 0 ? (request.history.map((step, index) => (
                            <div className="request-page-history-item" key={index} onClick={() => {aboutToDel===index?delHistoryStep(index):setAboutToDel(index)}}>
                                {step}
                            </div>
                            ))) : (<p className="request-page-description">No history yet</p>)
                        }
                        {request.history?.length > 1 &&
                            user?.role === "operator" &&
                            user.id === request.operatorId &&
                            request.status !== "completed" &&
                            (<p className="request-page-description request-page-small-text">{aboutToDel !== null? aboutToDel !== 0? "U sure?" : "Can't delete the first step" :"Click on a history step twice to delete it"}</p>)
                        }
                    </div>
                </div>

                <div className="request-page-bottom">
                    {user?.role === "operator" && (
                        <div className="request-page-actions">
                            <div className="request-page-card">
                                <h2>Add comment</h2>
                                <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="login-input description-input" placeholder="Enter comment"/>
                                {cerror !== "" && <p className="error-box-text err">{cerror}</p>}
                                <button onClick={onComment} className="request-page-btn">Post</button>
                            </div>

                            {user.id === request.operatorId &&
                                request.status !== "completed" &&(
                                <div className="request-page-card">
                                    <h2>Update history</h2>
                                    <textarea value={historyStep} onChange={(e) => setHistoryStep(e.target.value)} className="login-input description-input" placeholder="Enter history step"/>
                                    {herror !== "" && <p className="error-box-text err">{herror}</p>}
                                    <button onClick={onHistroyChange} className="request-page-btn">Post</button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="request-page-comments">
                        <h2>Comments</h2>

                        {request.comments?.length > 0 ? (
                            request.comments.map((comment, index) => (
                                <div key={index} className="request-page-comment">{comment}</div>
                            ))) : (<p className="request-page-description">No comments yet</p>)
                        }
                    </div>
                </div>
            </div>
        );
    }

    return (
        error !== "" ? <Error/> : <Contains/>
    );
}

export default Request;