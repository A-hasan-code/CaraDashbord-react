import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Protect = ({ element }) => {
  const { isAuthenticated } = useSelector((state) => state.user);

  if (isAuthenticated) {
    console.log(isAuthenticated)
    return <Navigate to="/dashboard/home" />;
  }

 
  return element;
};

export default Protect;
