import React, { useState, useEffect } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from 'react-router-dom'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Redux imports
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/Redux/slices/User.Slice'; 
import Axios from '@/Api/Axios';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true); // Initially loading
  const [isIframe, setIsIframe] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false); // Track auto-authentication status

  // Redux state and dispatch
  const dispatch = useDispatch();
  const { error, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  // Use useLocation to access the query parameters (location and token)
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const locationId = params.get('location');
  const token = params.get('token');

  console.log('Location ID:', locationId);
  console.log('Token:', token);

  // Function to check if the page is in an iframe
  const checkIfIframe = () => {
    if (window.self !== window.top) {
      setIsIframe(true); 
    } else {
      setIsIframe(false); 
    }
  };

  // Handle automatic authentication if iframe is detected
  const autoAuth = async () => {
    if (!locationId || !token) {
      toast.error("Location and token are required.");
      setLoading(false);
      setIsAuthenticating(false); // End authentication process
      return;
    }

    try {
      setIsAuthenticating(true); // Start auto-authentication
      const response = await Axios.get(`/auth/connect?location=${locationId}&token=${token}`);

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        sessionStorage.setItem("showToast", "true");
        toast.success("Authenticated successfully!");
        setLoading(false);
        navigate("/dashboard/gallery"); 
         window.location.reload();
      } else {
        toast.error("Authentication failed.");
        setLoading(false);
        setIsAuthenticating(false); // End authentication process
      }
   
    } catch (error) {
      console.error("Authentication Error:", error);
      toast.error("Error during authentication.");
      setLoading(false);
      setIsAuthenticating(false); // End authentication process
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      toast.error("Email is required.");
      return;
    }

    if (!password) {
      toast.error("Password is required.");
      return;
    }

    try {
      const resultAction = await dispatch(login({ email, password }));

      if (login.fulfilled.match(resultAction)) {
        toast.success("Successfully signed in!");
        navigate("/dashboard/gallery"); 
      } else {
        toast.error(resultAction.payload || "Login failed.");
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message || "Login failed.");
    }
  };

  useEffect(() => {
    checkIfIframe();
    if (isIframe ) {
      
      autoAuth(); // Trigger the automatic authentication if iframe detected
    } else {
      setLoading(false); // Allow sign-in form to render if not in iframe
      setIsAuthenticating(false); // End authentication process when not in iframe
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
    <section className="m-8 flex gap-4">
      <ToastContainer />
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Enter your email and password to Sign In.
          </Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                size="lg"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div className="flex justify-end cursor-pointer mt-3">
            <Link to="/forgot-password">
              <Typography variant="small" color="blue-gray" className="font-medium">
                Forgot password?
              </Typography>
            </Link>
          </div>
          <Button className="mt-3" type="submit" fullWidth>
            Sign In
          </Button>
          {error && <Typography className="text-red-500">{error.message}</Typography>} 
        </form>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
    </section>
  );
}

export default SignIn;
