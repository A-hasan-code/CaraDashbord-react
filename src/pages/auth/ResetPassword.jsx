import { useState } from "react";
import {
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useNavigate } from 'react-router-dom';

export function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!password || !confirmPassword) {
            setPasswordError("Both fields are required.");
            return;
        } else if (password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }
        setPasswordError("");
        try {
            // Add API call for password reset here
            toast.success("Password reset successful.");
            navigate("/sign-in");
        } catch (error) {
            toast.error(error.message || "Failed to reset password.");
        }
    };

    return (
        <section className="m-4 flex flex-col lg:flex-row gap-4 min-h-screen">
            <ToastContainer />

            {/* Left Side - Image */}
            <div className="w-full lg:w-2/5 h-full hidden lg:block">
                <img
                    src="/img/pattern.png"
                    className="h-full w-full object-cover rounded-3xl"
                    alt="Reset Background"
                />
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-3/5 mt-12 lg:mt-24 px-4">
                <div className="text-center">
                    <Typography variant="h2" className="text-[2rem] font-medium text-[#5742e3] mb-4">
                        Reset Password
                    </Typography>
                    <Typography variant="paragraph" className="text-base text-blue-gray-700 font-medium">
                        Enter a new password to reset your account.
                    </Typography>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 mx-auto w-full max-w-md">
                    {/* Password Field */}
                    <div className="mb-6">
                        <Typography variant="small" className="mb-1 font-medium text-[#5742e3]">
                            New Password
                        </Typography>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                size="lg"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`focus:!border-[#5742e3] border border-[#d9d9d9] ${passwordError ? 'border-red-500' : ''}`}
                            />
                            <span
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-gray-500" />
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="mb-6">
                        <Typography variant="small" className="mb-1 font-medium text-[#5742e3]">
                            Confirm New Password
                        </Typography>
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                size="lg"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`focus:!border-[#5742e3] border border-[#d9d9d9] ${passwordError ? 'border-red-500' : ''}`}
                            />
                            <span
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-gray-500" />
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {passwordError && (
                        <Typography variant="small" color="red" className="mb-4 text-sm">
                            {passwordError}
                        </Typography>
                    )}

                    {/* Submit Button */}
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

export default ResetPassword;