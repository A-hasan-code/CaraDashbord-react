import React from 'react';
import {
  Modal,
  Box,
  TextField,
   Select,
   MenuItem,
   InputLabel,
  FormControl,
  Typography,
  Button,
} from '@mui/material';

const ModalComponent = ({ open, onClose, onSubmit, userData, setUserData, isEditMode }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
     
      role: 'company',
     
    }));
  };
console.log(userData)
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
        <Typography variant="h6" sx={{ mb: 3, fontWeight: '600', fontSize: '1.25rem', color: '#5742e3' }}>
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

        {/* Role (Hidden/Commented) */}
        {/*
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
        */}

        {/* Status (Hidden/Commented) */}
      
        <FormControl fullWidth margin="normal" size="small">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={userData?.status}
            onChange={handleChange}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
       

        {/* Location */}
  {!isEditMode && (      <TextField
          label="Location ID"
          name="location_id"
          value={userData?.location_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
          size="small"
        />
 )}
        {/* Password - Fixed */}
        
          <TextField
            label="Password"
            name="password"
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
