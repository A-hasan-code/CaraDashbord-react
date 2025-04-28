import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUser, getUserProfile, updateUserProfile, forgotPassword, resetPassword, getAllUsers, logoutUser, updateUserBySuperadmin, deleteUserBySuperadmin } from '../../Api/Users';
import {sync} from '@/Api/Settingsapi'
// Async thunks for API calls
export const register = createAsyncThunk('user/register', async (userData, { rejectWithValue }) => {
    try {
        const data = await registerUser(userData);
        return data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const login = createAsyncThunk('user/login', async (loginData, { rejectWithValue, dispatch }) => {
    try {
        const data = await loginUser(loginData);
        if (data.token) {
            localStorage.setItem('token', data.token);

            dispatch(setUser(data.user)); // Set user and authentication state
        }
        const alreadySynced = sessionStorage.getItem('synced');
        if (!alreadySynced) {
            sync() // no await — this will run in background
                .then(() => sessionStorage.setItem('synced', 'true'))
                .catch((err) => console.error('Sync error (background):', err));
        }
    
    
        return data;
    } catch (error) {
        console.log('slice', error )
        return rejectWithValue(error|| 'email or password is incorrect');
    }
});

export const fetchUserProfile = createAsyncThunk('user/fetchUserProfile', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        const data = await getUserProfile(); // Fetch user profile data
        return data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const updateProfile = createAsyncThunk('user/updateProfile', async (updateData, { rejectWithValue }) => {
    try {
        const data = await updateUserProfile(updateData); // Update user profile
        return data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const logout = createAsyncThunk('user/logout', async (_, { dispatch }) => {
    try {
        localStorage.removeItem('token'); // Remove token from localStorage
        dispatch(clearUser()); // Clear user and authentication state
    } catch (error) {
        return rejectWithValue(error);
    }
});
export const fetchAllUsers = createAsyncThunk('users/getAll', async (_, { rejectWithValue }) => {
    try {
        const data = await getAllUsers();
        return data;
    } catch (error) {
        return rejectWithValue(error);
    }
});
export const updateUserSuperadmin = createAsyncThunk(
    'user/updateBySuperadmin',
    async ({ userId, updatedData }, { rejectWithValue }) => {
        try {
            const data = await updateUserBySuperadmin(userId, updatedData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteUserSuperadmin = createAsyncThunk(
    'user/deleteBySuperadmin',
    async (userId, { rejectWithValue }) => {
        try {
            const data = await deleteUserBySuperadmin(userId);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
// Initial state for the slice
const initialState = {
    user: null,
    isAuthenticated: localStorage.getItem('token') ? true : false,
    loading: false,
    error: null,
    users: [],
};

// The slice definition
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
        setUserFromLocalStorage: (state) => {
            const token = localStorage.getItem('token');
            if (token) {
                state.isAuthenticated = true;

            } else {
                state.isAuthenticated = false;
                state.user = null; // Ensure user is null after logout
            }
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;


            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(updateUserSuperadmin.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUserSuperadmin.fulfilled, (state, action) => {
                state.loading = false;
                const updatedUser = action.payload.data;

            })
            .addCase(updateUserSuperadmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete user by superadmin
            .addCase(deleteUserSuperadmin.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUserSuperadmin.fulfilled, (state, action) => {
                state.loading = false;
                const deletedUser = action.payload.data;

            })
            .addCase(deleteUserSuperadmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            ;
    },
});

export const { setUser, clearError, clearUser, setUserFromLocalStorage } = userSlice.actions;

export default userSlice.reducer;
