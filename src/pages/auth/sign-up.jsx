import { useState } from "react";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';


export function SignUp() {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

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

    // try {
    //   await dispatch(login({ email, password })).unwrap(); 
    //   toast.success("Successfully signed in!"); 
    //   navigate("/dashboard/home"); // Navigate to the dashboard
    // } catch (error) {
    //   toast.error(error.message || "Login failed."); 
    // }
  };

  return (
    <section className="m-8 flex">
      <ToastContainer />
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to register.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Enter Email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Choose Password
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
          <Button className="mt-6" type="submit" fullWidth disabled={loading}>
            {loading ? 'Signing up...' : 'Create user'}
          </Button>
          {error && <Typography className="text-red-500">{error}</Typography>}
        </form>
      </div>
    </section>
  );
}

export default SignUp;
