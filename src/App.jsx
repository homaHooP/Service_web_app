import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute, GuestRoute } from "./helpers/Routes.jsx";
import { AuthProvider } from "./hooks/AuthContext";
import Login from "./pages/LoginPage.jsx";
import ClientHomePage from "./pages/ClientHomePage.jsx";
import OperatorHomePage from "./pages/OperatorHomePage.jsx";
import NotFound from "./pages/NotFoundPage.jsx";
import NotAllowed from "./pages/NotAllowedPage.jsx";
import RequestPage from "./pages/RequestPage.jsx";

function AppContent() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<GuestRoute><Login/></GuestRoute>}/>
                        <Route path="/ClientHomePage" element={<ProtectedRoute allowedRoles = {["client"]}><ClientHomePage/></ProtectedRoute>}/>
                        <Route path="/OperatorHomePage" element={<ProtectedRoute allowedRoles = {["operator"]}><OperatorHomePage/></ProtectedRoute>}/>
                        <Route path="/NotAllowedPage" element={<NotAllowed/>}/>
                        <Route path="/requests/:id" element={<ProtectedRoute allowedRoles = {["client","operator"]}><RequestPage /></ProtectedRoute>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    )
}

function App() {
    return (
        <>
            <AppContent/>
        </>
    )
}

export default App
