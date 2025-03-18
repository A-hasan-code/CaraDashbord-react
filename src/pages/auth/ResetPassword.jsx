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

    // Handle Reset Password Logic
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
        <section className="m-8 flex gap-4">
            <ToastContainer />
            {/* Left Side - Image */}
            <div className="w-2/5 h-full hidden lg:block">
                <img
                    src="/img/pattern.png"
                    className="h-full w-full object-cover rounded-3xl"
                />
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-3/5 mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">
                        Reset Password
                    </Typography>
                    <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
                        Enter a new password to reset your account.
                    </Typography>
                </div>

                <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
                    {/* Password Field */}
                    <div className="mb-4">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                            New Password
                        </Typography>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                size="lg"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${passwordError ? 'border-red-500' : ''}`}
                            />
                            {/* Toggle Password Visibility */}
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
                    <div className="mb-4">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                            Confirm New Password
                        </Typography>
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                size="lg"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${passwordError ? 'border-red-500' : ''}`}
                            />
                            {/* Toggle Confirm Password Visibility */}
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
                        <Typography variant="small" color="red" className="mb-2">
                            {passwordError}
                        </Typography>
                    )}

                    {/* Submit Button */}
                    <Button className="mt-3" type="submit" fullWidth>
                        Reset Password
                    </Button>
                </form>
            </div>
        </section>
    );
}

export default ResetPassword;
