import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '@/Api/Axios'; // Ensure Axios is correctly set up

// Regular fetch with loading
export const getGallery = createAsyncThunk(
    'gallery/getGallery',
    async ({ page = 1, limit = 16, tags = '', startDate, endDate, sortName, sortDate }, { rejectWithValue }) => {
        try {
            const response = await Axios.get('/galleryview', {
                params: { page, limit, tags, startDate, endDate, sortName, sortDate }
            });
            return response.data;
        } catch (error) {
            // Return error message if response is not available
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

const initialState = {
    gallery: [],
    loading: false,
    error: null,
    page: 1,
    limit: 48,
    totalContacts: 0,
    sortName: 'asc',
    sortDate: 'asc',
};

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
        setSortName: (state, action) => {
            state.sortName = action.payload;
        },
        setSortDate: (state, action) => {
            state.sortDate = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getGallery.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGallery.fulfilled, (state, action) => {
                state.loading = false;
                state.gallery = action.payload.contacts;  // Ensure correct property name from the API response
                state.totalContacts = action.payload.totalContacts;  // Ensure the `totalContacts` is coming as expected from the API
            })
            .addCase(getGallery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error occurred while fetching gallery';
            });
    },
});

export const { setPage, setLimit, setSortName, setSortDate } = gallerySlice.actions;
export default gallerySlice.reducer;
