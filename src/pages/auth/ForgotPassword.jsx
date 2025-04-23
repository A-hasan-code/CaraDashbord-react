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

        setEmailError("");

        try {
            // Perform forgot password logic here
            toast.success("Password reset link sent to your email.");
        } catch (error) {
            toast.error(error.message || "Failed to reset password.");
        }
    };

    return (
        <section className="m-4 flex flex-col lg:flex-row gap-4 min-h-screen">
            <ToastContainer />

            {/* Image Section */}
            <div className="w-full lg:w-2/5 h-full hidden lg:block">
                <img
                    src="/img/pattern.png"
                    className="h-full w-full object-cover rounded-3xl"
                    alt="Forgot Background"
                />
            </div>

            {/* Form Section */}
            <div className="w-full lg:w-3/5 mt-12 lg:mt-24 px-4">
                <div className="text-center">
                    <Typography variant="h2" className="text-[2rem] font-medium text-[#5742e3] mb-4">
                        Forgot Password
                    </Typography>
                    <Typography variant="paragraph" className="text-base text-blue-gray-700 font-medium">
                        Enter your email to reset your password.
                    </Typography>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 mx-auto w-full max-w-md">
                    <div className="mb-6">
                        <Typography variant="small" className="mb-1 font-medium text-[#5742e3]">
                            Your email
                        </Typography>
                        <Input
                            size="lg"
                            placeholder="name@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`focus:!border-[#5742e3] border border-[#d9d9d9] ${emailError ? 'border-red-500' : ''}`}
                        />
                        {emailError && (
                            <Typography variant="small" color="red" className="mt-2 text-sm">
                                {emailError}
                            </Typography>
                        )}
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        className="bg-[#e9eafb] text-[#5742e3] hover:bg-[#accdfa] transition-colors"
                    >
                        Reset Password
                    </Button>
                </form>
            </div>
        </section>
    );
}

export default ForgotPassword;