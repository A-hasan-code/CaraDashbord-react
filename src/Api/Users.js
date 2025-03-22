import Axios from './Axios';

// Register a new user
export const registerUser = async (userData) => {
    try {
        const response = await Axios.post('/register', userData);
        return response.data;
    } catch (error) {
        throw error.response.data;  // Handle error
    }
};

// Login user
export const loginUser = async (loginData) => {
    try {
        const response = await Axios.post('/login', loginData);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error.response.data;  // Handle error
    }
};

// Get user profile (Authenticated)
export const getUserProfile = async () => {
    try {
        const response = await Axios.get('/profile');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Update user profile (Authenticated)
export const updateUserProfile = async (updateData) => {
    try {
        const response = await Axios.put('/profile', updateData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Forgot password
export const forgotPassword = async (email) => {
    try {
        const response = await Axios.post('/forgot-password', { email });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Reset password
export const resetPassword = async (resetToken, newPassword) => {
    try {
        const response = await Axios.put(`/reset-password/${resetToken}`, { password: newPassword });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Get all users (Authenticated)
export const getAllUsers = async () => {
    try {
        const response = await Axios.get('/getall');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Logout user (Authenticated)
export const logoutUser = async () => {
    try {
        const response = await Axios.get('/logout');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Update user by superadmin
export const updateUserBySuperadmin = async (userId, updatedData) => {
    try {
        console.log('Sending update request for user:', userId, 'with data:', updatedData);
        const response = await Axios.put(`/edit/${userId}`, updatedData);
        console.log('Response data from updateUserBySuperadmin:', response.data);
        return response.data;  // Return the response if needed
    } catch (error) {
        console.error('Error updating user:', error.response?.data || error.message);
        return error.response?.data || error.message;  // Return the error message if needed
    }
};

// Delete user by superadmin
export const deleteUserBySuperadmin = async (userId) => {
    try {
        console.log('Sending delete request for user:', userId);
        const response = await Axios.delete(`/adminuser/${userId}`);
        console.log('Response data from deleteUserBySuperadmin:', response.data);
        return response.data;  // Return the response if needed
    } catch (error) {
        console.error('Error deleting user:', error.response?.data || error.message);
        return error.response?.data || error.message;  // Return the error message if needed
    }
};

