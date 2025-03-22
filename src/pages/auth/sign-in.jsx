import { useState } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Redux imports
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/Redux/slices/User.Slice'; // Import the login action from the user slice

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Redux state and dispatch
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.user); // Access loading, error, and isAuthenticated states
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!email) {
      toast.error("Email is required.");
      return;
    }

    if (!password) {
      toast.error("Password is required.");
      return;
    }

    try {
      // Dispatch login action and wait for response
      const resultAction = await dispatch(login({ email, password }));

      // Check if login was successful
      if (login.fulfilled.match(resultAction)) {
        console.log(login.fulfilled.match(resultAction))
        toast.success("Successfully signed in!");
        navigate("/dashboard/home"); // Navigate to the dashboard after successful login
      } else {
        toast.error(resultAction.payload || "Login failed.");
      }
    } catch (error) {
      toast.error(error.message || "Login failed.");
    }
  };

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
          <Button className="mt-3" type="submit" fullWidth disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
          {error && <Typography className="text-red-500">{error}</Typography>} {/* Display the error here */}
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
