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

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth/login', {
                state: { from: location.pathname }
            });
        }
    }, [isAuthenticated, navigate, location]);

    return isAuthenticated ? children : null;
};

export default ProtectedRoutes;