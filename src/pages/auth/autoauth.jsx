import React,{useEffect, useState} from 'react'
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import Axios from '@/Api/Axios';
const autoauth = () => {
      const [isIframe, setIsIframe] = useState(false);
      const [isAuthenticating, setIsAuthenticating] = useState(false);
      const location = useLocation();
       const navigate = useNavigate();
        const [loading, setLoading] = useState(true);
        const params = new URLSearchParams(location.search);
        const locationId = params.get('location');
        console.log(locationId)
        const token = params.get('token');
        const dispatch = useDispatch();
        const checkIfIframe = () => {
          if (window.self !== window.top) setIsIframe(true);
          else setIsIframe(false);
        };
      
        const autoAuth = async () => {
          if (!locationId || !token) {
            toast.error("Location and token are required.");
            setLoading(false);
            setIsAuthenticating(false);
            return;
          }
          try {
            setIsAuthenticating(true);
            const response = await Axios.get(`/auth/connect?location=${locationId}&token=${token}`);
            if (response.data.success) {
              localStorage.setItem('token', response.data.token);
              sessionStorage.setItem("showToast", "true");
              toast.success("Authenticated successfully!");
              setLoading(false);
              navigate("/dashboard/gallery");
              window.location.reload();
            } 
          } catch (error) {
            console.error("Authentication Error:", error);
            toast.error("Error during authentication.");
            setLoading(false);
            setIsAuthenticating(false);
          }
        };
         useEffect(() => {
            checkIfIframe();
            if (isIframe) autoAuth();
            else {
              setLoading(false);
              setIsAuthenticating(false);
            }
          }, [isIframe, locationId, token]);
        
          if (loading || isAuthenticating) {
            return (
              <div className="flex justify-center items-center h-screen">
                <div className="spinner-border animate-spin border-4 rounded-full w-16 h-16 border-t-transparent"></div>
              </div>
            );
          }
  return (
    <div>
      
    </div>
  )
}

export default autoauth
