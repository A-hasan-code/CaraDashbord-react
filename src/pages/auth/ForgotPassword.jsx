import { useState } from "react";
import {
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email) {
            setEmailError("Email is required.");
            return;
        } else if (!validateEmail(email)) {
            setEmailError("Invalid email format.");
            return;
        }

        setEmailError(""); // Clear previous error if any

        try {
            // Perform forgot password logic here (e.g., API call)
            toast.success("Password reset link sent to your email.");
        } catch (error) {
            toast.error(error.message || "Failed to reset password.");
        }
    };

    return (
        <section className="m-8 flex gap-4">
            <ToastContainer />

            {/* Moved the image to the left side */}
            <div className="w-2/5 h-full hidden lg:block">
                <img
                    src="/img/pattern.png"
                    className="h-full w-full object-cover rounded-3xl"
                />
            </div>

            <div className="w-full lg:w-3/5 mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">Forgot Password</Typography>
                    <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
                        Enter your email to reset your password.
                    </Typography>
                </div>
                <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
                    <div className="mb-1 flex flex-col gap-2">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                            Your email
                        </Typography>
                        <Input
                            size="lg"
                            placeholder="name@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${emailError ? 'border-red-500' : ''}`}
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                        />
                        {emailError && (
                            <Typography variant="small" color="red" className="mt-1">
                                {emailError}
                            </Typography>
                        )}
                    </div>
                    <Button className="mt-3" type="submit" fullWidth>
                        Reset Password
                    </Button>
                </form>
            </div>
        </section>
    );
}

export default ForgotPassword;
