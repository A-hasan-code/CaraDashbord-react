import React, { useState, useEffect } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/Redux/slices/User.Slice';
import Axios from '@/Api/Axios';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  


  const dispatch = useDispatch();
  const { error, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  console.log("isAuthenticated", error, isAuthenticated)

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) return toast.error("Email is required.");
    if (!password) return toast.error("Password is required.");
    try {
      const resultAction = await dispatch(login({ email, password }));
      if (login.fulfilled.match(resultAction)) {
        toast.success("Successfully signed in!");
       if (resultAction.payload?.user?.role === "superadmin") {
    navigate("/dashboard/home");
  } else if (resultAction.payload?.user?.role === "company") {
    navigate("/dashboard/gallery");
  } else {
    navigate("/dashboard/home"); // default fallback
  }
      }else{
        toast.error(error);
      }
    } catch (error) {

      console.error("Login Error:", error);
      toast.error(error.message || "Login failed.");
    }
    
  };

 

  return (
    <section className="m-4 flex flex-col lg:flex-row gap-4 justify-center items-center  ">

      <div className="w-full lg:w-3/5 mt-12 lg:mt-24 px-4">
        
        <div className="text-center">
          <Typography variant="h2" className="font-medium text-[2rem] text-[#5742e3] mb-4">
            Sign In
          </Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-base font-medium">
            Enter your email and password to Sign In.
          </Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mx-auto w-full max-w-md">
          <div className="mb-6 flex flex-col gap-6">
            <div>
              <Typography variant="small" className="mb-1 font-medium text-[#5742e3]">
                Your email
              </Typography>
              <Input
                size="lg"
                placeholder="name@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:!border-[#5742e3] border border-[#d9d9d9]"
              />
            </div>
            <div>
              <Typography variant="small" className="mb-1 font-medium text-[#5742e3]">
                Password
              </Typography>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  size="lg"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:!border-[#5742e3] border border-[#d9d9d9]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-[#5742e3]"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end mb-4">
            <Link to="/forgot-password" className="text-sm text-[#5742e3] font-medium">
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            fullWidth
            className="bg-[#e9eafb] text-[#5742e3] hover:bg-[#accdfa] transition-colors"
          >
            Sign In
          </Button>
          {error && <Typography className="text-red-500 text-sm mt-2">{error}</Typography>}
        </form>
      </div>
      <div className="w-[70%] lg:w-[33%]  hidden lg:block">
        <img
          src="/img/pattern.png"
          className=" w-full object-cover rounded-3xl"
          alt="Background"
        />
     
      </div>
    </section>
  );
}

export default SignIn;