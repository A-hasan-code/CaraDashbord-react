import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, IconButton } from '@mui/material';
import { FaPen } from 'react-icons/fa'; // Pencil icon for editing
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaLink } from 'react-icons/fa';
import CustomFieldsSelection from '@/widgets/customfileds/Customfeld';
import { useDispatch, useSelector } from 'react-redux';
import { getClientSettings, saveClientSettings, setIsEditing, setClientData, getImageSettings } from '@/Redux/slices/secretIdSlice'; 
import Axios from '@/Api/Axios'
import { useLocation } from 'react-router-dom'; // Import useLocation

export const Settings = () => {
    const [logo, setLogo] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [Cloading, setLoading] = useState(false); // Loading state
    const [responseData, setResponseData] = useState(null); // Response data from API
    const [Cerror, setError] = useState(null);
    const { user, error, loading } = useSelector((state) => state.user);
    console.log(user)
    const dispatch = useDispatch();

    // Access Redux state
    const { clientId, clientSecret, isEditing, logo: imagelogo, } = useSelector((state) => state.clientIdsSet);

    // Use useLocation to get the current URL
    const location = useLocation();
    
    useEffect(() => {
        // Check if the URL contains the query parameter 'connected' or 'error'
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.has('connected')) {
            toast.success('GHL connected successfully!');
        } else if (queryParams.has('error')) {
            toast.error('GHL is not connected');
        }

        if (!isEditing) {
            dispatch(getClientSettings(clientId, clientSecret)); // Fetch settings when not editing
            dispatch(getImageSettings()); // Fetch image settings (logo and cover)
        }
    }, [dispatch, clientId, clientSecret, isEditing, location]);

    const handleButtonClick = async () => {
        setLoading(true); // Show loading when button is clicked
        setError(null); // Reset any previous error messages

        try {
            // Make the API call
            const response = await Axios.get('/auth');
            console.log(response.data);
            window.location.href = response.data.redirectUrl;
        } catch (err) {
            setError('Error occurred: ' + err.message); // Display error message
        } finally {
            setLoading(false); // Reset loading state after the request is complete
        }
    };

    // Trigger the file input click programmatically
    const triggerFileInput = () => {
        document.getElementById('file-input').click();
    };

    const handleSave = () => {
        try {
            dispatch(saveClientSettings({ clientId, clientSecret })); // Dispatch the save action
            toast.success('Settings saved successfully!');
            dispatch(setIsEditing(false)); // Turn off editing after saving
        } catch (error) {
            toast.error(error.message || 'User settings not saved');
        }
    };

    const handleEdit = () => {
        dispatch(setIsEditing(true));  // Enable editing mode
    };

    const handleClientIdChange = (e) => {
        const newClientId = e.target.value;
        console.log('Client ID changed:', newClientId);
        dispatch(setClientData({ clientId: newClientId, clientSecret }));
    };

    const handleClientSecretChange = (e) => {
        const newClientSecret = e.target.value;
        console.log('Client Secret changed:', newClientSecret);
        dispatch(setClientData({ clientId, clientSecret: newClientSecret }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        setLogo(file);
        setImagePreview(URL.createObjectURL(file));  // Show image preview

        // Create FormData to send to the API
        const formData = new FormData();
        formData.append('image', file); // Append the image file
        formData.append('key', 'logo'); // Add the key as 'logo' (can be dynamic)

        try {
            // Make the API call to upload the image and store the URL
            setLoading(true);
            const response = await Axios.post('/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            // Assuming the API returns the URL of the uploaded image
            if (response.data && response.data.setting) {
                toast.success('Logo uploaded successfully!');
                dispatch(getImageSettings())
                // Optionally update your Redux state or any other UI feedback here
            }
        } catch (error) {
            setError('Failed to upload image: ' + error.message);
            toast.error(error.message || 'Failed to upload logo');
            dispatch(getImageSettings())
        } finally {
            setLoading(false);
        }
    };

    // Function to clear the logo and image preview
    const handleRemoveLogo = () => {
        setLogo(null);
        setImagePreview(null);
    };

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                {/* First Card - Client Settings */}
                {user?.role === 'superadmin' && (  <Card className="w-full p-4 shadow-md border rounded-lg">
                    <CardContent>
                        <div className="flex justify-between items-center mb-4">
                            <Typography variant="h6">Client Settings</Typography>
                            <IconButton onClick={handleEdit} disabled={isEditing} color="primary">
                                <FaPen />
                            </IconButton>
                        </div>

                        {/* Both fields are visible and editable in edit mode */}
                        <TextField
                            label="Client ID"
                            value={clientId}
                            onChange={handleClientIdChange}
                            disabled={!isEditing}  // Disabled when not editing
                            id="margin-normal"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            size="small"
                        />

                        <TextField
                            label="Client Secret"
                            value={clientSecret}
                            onChange={handleClientSecretChange}
                            disabled={!isEditing}  // Disabled when not editing
                            id="margin-normal"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            size="small"
                        />

                        {/* Show Save Button only when editing */}
                        {isEditing && (
                            <div
                                className="bg-black text-white text-center max-h-12 p-4 rounded-md cursor-pointer hover:bg-gray-700 transition-all duration-300"
                                onClick={handleSave}
                            >
                                Save Settings
                            </div>
                        )}
                    </CardContent>
                </Card>)}

                {/* Second Card - Static Image & Connect Button */}
                <Card className="w-full mx-auto p-4 shadow-md border rounded-lg">
                    <CardContent className="text-center">
                        <img
                            src={"https://ghlcentral.com/wp-content/uploads/2023/03/GHL-on-blue-580x400.webp"}
                            alt="GoHighLevel"
                            className="mx-auto mb-4"
                        />
                        <div className="bg-black text-white p-4 rounded-lg cursor-pointer flex items-center justify-center space-x-2 w-full hover:bg-gray-700 transition-all duration-300"   onClick={handleButtonClick}>
                            <FaLink size={20} />
                            <span>Connect</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Third Card - Image Upload */}
              <Card className="w-full mx-auto p-4 shadow-md border rounded-lg">
    <CardContent className="text-center">
        <Typography variant="h6" className="mb-4">Upload Logo</Typography>

        {/* Display logo from Redux state or preview */}
        {imagelogo || imagePreview ? (
            <div className="relative">
                <img
                    src={`http://localhost:5000${imagelogo}` || imagePreview}  // Use Redux logo or the imagePreview state
                    alt="Logo Preview"
                    className="w-48 h-48 object-cover mx-auto mb-4 rounded-lg"
                />
                <button
                    onClick={handleRemoveLogo}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                    X
                </button>
            </div>
        ) : (
            <div className="w-48 h-48 border border-dashed border-gray-400 mb-4 flex justify-center items-center text-gray-400 rounded-lg">
                <span>No Preview</span>
            </div>
        )}

        {/* Upload Logo Button */}
        <div
            onClick={triggerFileInput}
            className="bg-black text-white p-3 rounded-lg cursor-pointer flex items-center justify-center space-x-2 w-full hover:bg-gray-800 transition-all duration-300"
        >
            <FaCloudUploadAlt size={30} />
            <span>Upload Logo</span>
        </div>

        {/* Hidden file input */}
        <input
            type="file"
            id="file-input"
            accept="image/*"
            onChange={handleImageChange}
            hidden
        />
    </CardContent>
</Card>

            </div>
            <CustomFieldsSelection />
        </div>
    );
};
