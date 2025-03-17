import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, TextField, IconButton, Stack } from '@mui/material';
import { FaPen } from 'react-icons/fa'; // Pencil icon for editing
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaLink } from 'react-icons/fa';
import CustomFieldsSelection from '@/widgets/customfileds/Customfeld';
import { useDispatch, useSelector } from 'react-redux';
import { setClientData, setIsEditing } from '@/Redux/slices/secretIdSlice';

export const Settings = () => {
    const [logo, setLogo] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const dispatch = useDispatch();

    // Access Redux state
    const { clientId, clientSecret, isEditing } = useSelector((state) => state.clientIdsSet);


    // Trigger the file input click programmatically
    const triggerFileInput = () => {
        document.getElementById('file-input').click();
    };

    const handleSave = () => {
        dispatch(setClientData({ clientId, clientSecret }));
        dispatch(setIsEditing(false));
    };

    const handleEdit = () => {
        dispatch(setIsEditing(true));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setLogo(file);
        setImagePreview(URL.createObjectURL(file)); // Set the image preview
    };

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                {/* First Card */}
                <Card className="w-full  p-4 shadow-md border rounded-lg">
                    <CardContent>
                        <div className="flex justify-between items-center mb-4">
                            <Typography variant="h6">Client Settings</Typography>
                            <IconButton onClick={handleEdit} disabled={isEditing} color="primary">
                                <FaPen />
                            </IconButton>
                        </div>
                        {/* Client ID TextField with bottom margin */}
                        <TextField
                            label="Client ID"
                            value={clientId}
                            onChange={(e) => dispatch(setClientData({ clientId: e.target.value, clientSecret }))}
                            disabled={!isEditing}
                            id="margin-normal"
                            fullWidth
                            margin="normal"

                            variant="outlined"
                            size="small"
                        />

                        {/* Client Secret TextField with bottom margin */}
                        <TextField
                            label="Client Secret"
                            value={clientSecret}
                            onChange={(e) => dispatch(setClientData({ clientId, clientSecret: e.target.value }))}
                            disabled={!isEditing}
                            id="margin-normal"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            size="small"
                        />
                        {/* Save button with added margin */}
                        {isEditing && (

                            <div
                                className="bg-black text-white text-center max-h-12 p-4 rounded-md cursor-pointer hover:bg-gray-700 transition-all duration-300"
                                onClick={handleSave}
                            >
                                Save Settings
                            </div>

                        )}
                    </CardContent>
                </Card>



                {/* Second Card - Static Image & Connect Button */}
                <Card className="w-full mx-auto p-4 shadow-md border rounded-lg">
                    <CardContent className="text-center">
                        <img
                            src="https://ghlcentral.com/wp-content/uploads/2023/03/GHL-on-blue-580x400.webp"
                            alt="GoHighLevel"
                            className="mx-auto mb-4"
                        />
                        <div className="bg-black text-white p-4 rounded-lg cursor-pointer flex items-center justify-center space-x-2 w-full hover:bg-gray-700 transition-all duration-300">
                            <FaLink size={20} /> {/* Connection icon */}
                            <span>Connect</span>
                        </div>

                    </CardContent>
                </Card>

                {/* Third Card - Image Upload */}
                <Card className="w-full mx-auto p-4 shadow-md border rounded-lg">
                    <CardContent className="text-center">
                        <Typography variant="h6" className="mb-4">Upload Logo</Typography>

                        {/* Display image preview or placeholder */}
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Logo Preview"
                                className="w-48 h-48 object-cover mx-auto mb-4 rounded-lg" // Adjusted size and added rounded corners
                            />
                        ) : (
                            <div className="w-48 h-48 border border-dashed border-gray-400 mb-4 flex justify-center items-center text-gray-400 rounded-lg">
                                <span>No Preview</span>
                            </div>
                        )}

                        {/* Upload Logo Button */}
                        <div
                            onClick={triggerFileInput}  // Trigger file input click when the div is clicked
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

                <ToastContainer />
            </div>
            <CustomFieldsSelection />
        </div>
    );
};
