import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext.jsx";

export function ProtectedRoute({ children, allowedRoles}) {
    const { user, token } = useAuth();

    if (!token || !user) {
        return <Navigate to="/" replace />;
    }

    if(allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/NotAllowedPage" replace />;
    }

    return children;
}

export function GuestRoute({ children }) {
    const { user, token } = useAuth();

    if (token && user) {
        if(user.role === "operator"){
            return <Navigate to="/OperatorHomePage" replace />;
        }
        else{
            return <Navigate to="/ClientHomePage" replace />;
        }
    }

    return children;
}
