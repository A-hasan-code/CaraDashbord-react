import React, { useEffect, useState } from 'react';
import { Modal, Box, TextField, Select, MenuItem, InputLabel, FormControl, Typography, Button } from '@mui/material';

const ModalComponent = ({ open, onClose, onSubmit, userData, setUserData, isEditMode }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value,
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
                    name="fullName"
                    value={userData.fullName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    size="small"
                />

                {/* Email */}
                <TextField
                    label="Email"
                    name="email"
                    value={userData.email}
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
                        value={userData.role}
                        onChange={handleChange}
                    >
                        <MenuItem value="User">User</MenuItem>
                        <MenuItem value="Manager">Manager</MenuItem>
                        <MenuItem value="Admin">Admin</MenuItem>
                    </Select>
                </FormControl>

                {/* Status */}
                <FormControl fullWidth margin="normal" size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                        name="status"
                        value={userData.status}
                        onChange={handleChange}
                    >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Not Active">Not Active</MenuItem>
                    </Select>
                </FormControl>

                {/* Location */}
                <TextField
                    label="Location"
                    name="location"
                    value={userData.location}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    size="small"
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
