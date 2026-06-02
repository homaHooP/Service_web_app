import image from "../images/pp.png";
import { useAuth } from "../hooks/AuthContext.jsx";

function Header(){
    const { user, logout } = useAuth();

    return (
        <header className="header">
            <div className="company-block">
                <div>
                    <h1 className="company-title">Service</h1>
                    <p className="company-subtitle">Cool service</p>
                </div>
            </div>

            <div className="user-container">
                <img className="user-avatar" src={image} alt="avatar"/>
                <div className="user-info">
                    <p className="user-name">{user.username}</p>
                    <p className="user-role">{user.role}</p>
                </div>
                <button className="logout-btn" onClick={logout}>Log out</button>
            </div>
        </header>
    )
}

export default Header;