import { useAppSelector } from "../hooks/hook";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

interface ProtectedRoutesProps {
  children: JSX.Element;
}

const ProtectedRoutes = ({ children }: ProtectedRoutesProps) => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const navigate = useNavigate();
    const location = useLocation();
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!accessToken) {
            console.log('No access token found');
            // Redirect to login page if user is not authenticated
            navigate('/auth/login', {
                state: { from: location.pathname }
            });
        }
    }, [isAuthenticated, navigate, location]);

    return isAuthenticated ? children : null;
};

export default ProtectedRoutes;