import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.user);
    // If the user is not authenticated, redirect to the login page
    if (!isAuthenticated) {
        return <Navigate to="/auth/sign-in" replace />;
    }

    // Otherwise, render the children (protected content)
    return children;
};


export default ProtectedRoute;
