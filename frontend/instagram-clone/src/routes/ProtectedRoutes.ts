import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";


interface ProtectedRoutesProps {
  children: JSX.Element;
}


const ProtectedRoutes = ({ children }: ProtectedRoutesProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const accessToken = localStorage.getItem('accessToken');


    
    useEffect(() => {
        if (!accessToken ) {
            console.log('No access token found');
            // Redirect to login page if user is not authenticated
            navigate('/auth/login', {
                state: { from: location.pathname }
            });
        }
    }, [ navigate, location]);

    return children 
};

export default ProtectedRoutes;