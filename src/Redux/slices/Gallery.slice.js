import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '@/Api/Axios'; // Assuming Axios is set up for API calls

// 1. Create the async thunk for fetching gallery data
export const getGallery = createAsyncThunk(
    'gallery/getGallery',
    async ({ page = 1, limit = 10, tags = '' }, { rejectWithValue }) => {
        try {
            const response = await Axios.get('/galleryview', {
                params: { page, limit, tags } // Pass the tags properly to the API
            });
            console.log('Fetched gallery:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching gallery:', error);
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// 2. Define the initial state for the slice
const initialState = {
    gallery: [],    // Stores the gallery data
    loading: false,  // Loading state to show spinner or loader
    error: null,     // Error state to handle failed requests
    page: 1,         // Current page for pagination
    limit: 10,       // Items per page limit
    totalContacts: 0 // Total contacts to manage pagination
};

// 3. Create the Redux slice
const gallerySlice = createSlice({
    name: 'gallery',
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setLimit: (state, action) => {
            state.limit = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle 'pending' state
            .addCase(getGallery.pending, (state) => {
                state.loading = true;
            })
            // Handle 'fulfilled' state when the API call is successful
            .addCase(getGallery.fulfilled, (state, action) => {
                state.loading = false;
                state.gallery = action.payload.contacts; // Store fetched contacts
                state.totalContacts = action.payload.totalContacts; // Total contacts count
            })
            // Handle 'rejected' state when the request fails
            .addCase(getGallery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error occurred while fetching gallery';
            });
    }
});

// Export the actions for later use in the components
export const { setPage, setLimit } = gallerySlice.actions;

// Export the reducer to be used in the store
export default gallerySlice.reducer;
