import React, { useEffect, useState } from 'react';
import { Modal, Box, TextField, Select, MenuItem, InputLabel, FormControl, Typography, Button } from '@mui/material';

const ModalComponent = ({ open, onClose, onSubmit, userData, setUserData, isEditMode }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value,
            password: '123456789'
        }));
    };
    const handleSubmit = () => {
        onSubmit();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 500,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                {/* Title */}
                <Typography variant="h6" color="blue-gray" sx={{ mb: 3, fontWeight: '600', fontSize: '1.25rem' }}>
                    {isEditMode ? 'Edit User' : 'Create User'}
                </Typography>

                {/* Full Name */}
                <TextField
                    label="Full Name"
                    name="name"
                    value={userData?.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    size="small"
                />

                {/* Email */}
                <TextField
                    label="Email"
                    name="email"
                    value={userData?.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    size="small"
                />

                {/* Role */}
                <FormControl fullWidth margin="normal" size="small">
                    <InputLabel>Role</InputLabel>
                    <Select
                        name="role"
                        value={userData?.role}
                        onChange={handleChange}
                    >
                        <MenuItem value="company">Company</MenuItem>
                        <MenuItem value="superadmin">Superadmin</MenuItem>
                    </Select>
                </FormControl>

                {/* Status */}
                <FormControl fullWidth margin="normal" size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                        name="status"
                        value={userData?.status}
                        onChange={handleChange}
                    >
                        <MenuItem value="active">active</MenuItem>
                        <MenuItem value="inactive">inactive</MenuItem>
                    </Select>
                </FormControl>

                {/* Location */}
                <TextField
                    label="Location_id"
                    name="location_id"
                    value={userData?.location_id}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    size="small"
                />

                {/* Password - Disabled, showing a fixed value */}
                <TextField
                    label="Password"
                    name="password"
                    value={userData?.password || '123456789'}  // Default value if password is empty
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    size="small"
                    disabled  // This makes the input field disabled
                />

                {/* Actions */}
                <div className="flex justify-end space-x-2 mt-6">
                    <Button onClick={onClose} variant="outlined" color="error" fullWidth>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth>
                        {isEditMode ? 'Edit' : 'Create'}
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default ModalComponent;
