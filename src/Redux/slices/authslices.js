import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, signupUser, logoutUser, fetchCurrentUser, updateUserProfile } from '@/Api/Users';
import { toast } from 'react-toastify';
import { loginDummyJson } from '@/data/dummyLogin';

// Async thunks
export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
    try {
        // const response = await loginUser(userData);
        localStorage.setItem('token', loginDummyJson?.token);
        document.cookie = `token=${loginDummyJson?.token}; path=/; Secure`;
        // return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const signup = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
    try {
        const response = await signupUser(userData);
        localStorage.setItem('access_token', response.token);
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const logout = createAsyncThunk('auth/logout', async () => {
    // await logoutUser();
    localStorage.removeItem('token');
});

export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
    try {
        const response = await fetchCurrentUser();
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
    try {
        const response = await updateUserProfile(profileData);
        return response; // Return the updated user data
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: !!localStorage.getItem('token'),
    },
    reducers: {
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(signup.pending, (state) => {
                state.loading = true;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = { ...state.user, ...action.payload }; // Merge updated profile data
                toast.success('Profile updated successfully');
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
    },
});

export const { clearUser } = authSlice.actions;
export default authSlice.reducer;
