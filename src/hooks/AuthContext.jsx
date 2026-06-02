import { createContext, useContext, useState } from "react";
import { AuthStorage } from "../helpers/AuthHelper";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(AuthStorage.getUser());
    const [token, setToken] = useState(AuthStorage.getToken());

    const login = (data) => {
        AuthStorage.save(data);
        setUser(data.user);
        setToken(data.token);
    };

    const logout = () => {
        AuthStorage.logout();
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);