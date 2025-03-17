import React, { useState } from "react";
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Tooltip,
  Button,
  Input,
} from "@material-tailwind/react";
import {
  PencilIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Richard Davisa",
    email: "richard.davisa@mail.com",
    password: "Dummy@123", // Dummy password
    confirmPassword: "Dummy@123", // Dummy confirm password
    location: "New York, USA",
    avatar: "/img/bruce-mars.jpeg",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          avatar: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const togglePasswordVisibility = (type) => {
    if (type === "password") {
      setShowPassword(!showPassword);
    } else if (type === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <>
      {/* Background Section */}
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-black/75 to-transparent" />
      </div>

      {/* Profile Card */}
      <Card className="mx-3 -mt-16 mb-10 lg:mx-4 border border-blue-gray-100 shadow-xl">
        <CardBody className="p-6 pb-10">
          {/* Avatar Section + Name */}
          <div className="flex flex-col items-center">
            <div className="mb-8 flex justify-center items-center">
              <div className="relative flex flex-col items-center">
                <Avatar
                  src={formData.avatar}
                  alt="User Avatar"
                  size="xl"
                  variant="rounded"
                  className="rounded-full shadow-lg shadow-blue-gray-500/40 border-4 border-white"
                />
                {isEditing && (
                  <div className="absolute bottom-1 right-1 bg-blue-500 p-1 rounded-full cursor-pointer hover:bg-blue-600 transition-all duration-200">
                    <button
                      onClick={() =>
                        document.getElementById("avatar-file-input").click()
                      }
                      className="flex items-center justify-center w-6 h-6 bg-transparent border-0 cursor-pointer"
                    >
                      <PencilIcon className="text-white w-4 h-4" />
                    </button>
                    <input
                      id="avatar-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Name and Role */}
              <div className="mt-4 text-center">
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="mb-1 font-semibold text-2xl"
                >
                  {formData.fullName}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600 text-lg"
                >
                  CEO / Co-Founder
                </Typography>
              </div>
            </div>

            {/* Edit Button */}
            <div className="mb-6">
              <Tooltip content="Edit Profile">
                <Button
                  variant="outlined"
                  onClick={handleEdit}
                  className="group flex items-center gap-2 px-5 py-2 text-blue-600 hover:text-white hover:bg-blue-600 border-2 border-blue-600 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <PencilIcon className="h-5 w-5" />
                  Edit
                </Button>
              </Tooltip>
            </div>
          </div>

          {/* Edit Profile Info Section */}
          <div className="mt-4">
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-3 text-xl font-semibold"
            >
              Basic Information
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing}
              />

              {/* Email */}
              <Input
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {/* Password + Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Password */}
              <div className="relative">
                <Input
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={!isEditing}
                  type={showPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("password")}
                  className="absolute right-3 top-2/4 -translate-y-2/4 text-blue-gray-500"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={!isEditing}
                  type={showConfirmPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  className="absolute right-3 top-2/4 -translate-y-2/4 text-blue-gray-500"
                >
                  {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Location */}
            <div className="mt-6">
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Typography color="red" className="mt-2 text-center">
              {error}
            </Typography>
          )}

          {/* Save Button - Centered */}
          {isEditing && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="filled"
                color="blue"
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                <CheckIcon className="h-5 w-5" />
                Save Changes
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
}

export default Profile;
