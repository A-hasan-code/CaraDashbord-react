import React, { useState, useEffect } from "react";
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
  EyeSlashIcon,ArrowLeftIcon 
} from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateProfile } from "@/Redux/slices/User.Slice";
import axios from "axios";
import { toast } from "react-toastify";

export function Profile() {
  const dispatch = useDispatch();
  const { user, error, loading } = useSelector((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location_id: "",
    image: "",
  });

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        confirmPassword: "",
        location_id: user.location_id,
        image: user.image
          ? `https://caradashboard-backend-production.up.railway.app${user.image}`
          : "https://missysue.com/wp-content/uploads/2019/08/half-up-dutch-braids-2.jpg", // Fallback image if no user image
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        image: file, // Store the file directly
      }));
    }
  };

  const handleSave = async () => {
    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please fill in both password fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("confirmPassword", formData.confirmPassword);
    formDataToSend.append("location_id", formData.location_id);

    if (formData.image && formData.image instanceof File) {
      formDataToSend.append("image", formData.image); // Append the image file directly
    }

    try {
      const response = await axios.put(
        "https://caradashboard-backend-production.up.railway.app/api/v1/profile",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        dispatch(fetchUserProfile());
      }
    } catch (err) {
      toast.error("Error updating profile: " + (err.response?.data?.message || err.message));
    }

    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing((prevState) => !prevState); // Toggle edit mode
  };

  const togglePasswordVisibility = (type) => {
    if (type === "password") {
      setShowPassword(!showPassword);
    } else if (type === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const goBack = () => {
    window.history.back(); // This will take the user back to the previous page
  };

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-black/75 to-transparent" />
        
      </div>

      <Card className="mx-3 -mt-16 mb-10 lg:mx-4 border border-blue-gray-100 shadow-xl">

        
        <CardBody className="p-6 pb-10">
 {/* Add "Back" Button */}
          <div className="mt-8 flex justify-end">
            <ArrowLeftIcon
              className="w-10 h-10 text-black cursor-pointer hover:text-blue-800"
              onClick={goBack}
            
            />
           
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-2 flex justify-center items-center">
              <div className="relative flex flex-col items-center">
                <Avatar
                  src={formData?.image instanceof File ? URL.createObjectURL(formData.image) : formData?.image} // If the image is a file, use object URL
                  alt="User Avatar"
                  className="h-[150px] w-[150px] shadow-lg shadow-blue-gray-500/40 border-2 border-white"
                   onError={(e) => {
    e.target.onerror = null; // Prevents infinite loop if fallback also fails
    e.target.src = "https://missysue.com/wp-content/uploads/2019/08/half-up-dutch-braids-2.jpg";
  }}
                />
                {isEditing && (
                  <div className="absolute bottom-1 right-1 bg-blue-500 p-1 rounded-full cursor-pointer hover:bg-blue-600 transition-all duration-200">
                    <button
                      onClick={() => document.getElementById("avatar-file-input").click()}
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
            </div>

            <div className="mt-2 mb-3 text-center">
              <Typography variant="h5" color="blue-gray" className="mb-1 font-semibold text-2xl">
                {formData.name}
              </Typography>
              <Typography variant="small" className="font-normal text-blue-gray-600 text-lg">
                {user?.role}
              </Typography>
            </div>

            <div className="mb-6">
              <Tooltip content={isEditing ? "Cancel Edit" : "Edit Profile"}>
                <Button
                  variant="outlined"
                  onClick={handleEdit}
                  className="group flex items-center gap-2 px-5 py-2 text-blue-600 hover:text-white hover:bg-blue-600 border-2 border-blue-600 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <PencilIcon className="h-5 w-5" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </Tooltip>
            </div>
          </div>

          <div className="mt-4">
            <Typography variant="h6" color="blue-gray" className="mb-3 text-xl font-semibold">
              Basic Information
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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

  {user?.role !== "superadmin" && (
  <div className="mt-6">
    <Input
      label="Location ID"
      name="location_id"
      value={formData.location_id}
      onChange={handleChange}
      disabled={!isEditing}
    />
  </div>
)}
          </div>

          {error && (
            <Typography color="red" className="mt-2 text-center">
              {error}
            </Typography>
          )}

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
