import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSettings, saveSettings, getimage } from '@/Api/Settingsapi';  // Import your API functions here
import { toast } from 'react-toastify';  // Import Toastify for notifications

// Async thunk to fetch client settings
export const getClientSettings = createAsyncThunk(
    'client/getSettings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getSettings();

            return response;  // Return the fetched settings
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error fetching settings');
        }
    }
);
export const getImageSettings = createAsyncThunk(
    'client/getImageSettings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getimage();
            return response; // Return the fetched logo and cover images
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error fetching image settings');
        }
    }
);
// Async thunk to save client settings
export const saveClientSettings = createAsyncThunk(
    'client/saveSettings',
    async ({ clientId, clientSecret }, { rejectWithValue }) => {
        try {
            console.log(clientId, clientSecret)
            const response = await saveSettings([
                { key: 'clientId', value: clientId },
                { key: 'clientSecret', value: clientSecret }
            ]);
            console.log('Settings saved successfully:', response);

            return response;  // Return the response to update Redux state
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error(error.message || 'Error saving settings!');
            return rejectWithValue(error.message || 'Error saving settings');
        }
    }
);

const initialState = {
    clientId: '',
    clientSecret: '',
    logo: '',
    cover: '',
    displaycf:'',
    isEditing: false,
    isLoading: false,
    error: null,
};

const clientSlice = createSlice({
    name: 'clientSettings',
    initialState,
    reducers: {
        setClientData: (state, action) => {
            state.clientId = action.payload.clientId;
            state.clientSecret = action.payload.clientSecret;
        },
        setIsEditing: (state, action) => {
            state.isEditing = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch client settings
            .addCase(getClientSettings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getClientSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.clientId = action.payload.clientId || state.clientId;
                state.clientSecret = action.payload.clientSecret || state.clientSecret;
                state.error = null;
            })
            .addCase(getClientSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            })

            // Save client settings
            .addCase(saveClientSettings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(saveClientSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.clientId = action.payload.clientId || state.clientId;
                state.clientSecret = action.payload.clientSecret || state.clientSecret;
                state.error = null;
            })
            .addCase(saveClientSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(getImageSettings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getImageSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.logo = action.payload.logo || state.logo;
                state.cover = action.payload.cover || state.cover;
                state.displaycf = action.payload.displaycf || state.displaycf; 
                state.error = null;
            })
            .addCase(getImageSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            });
    },
});


// Export actions
export const { setClientData, setIsEditing } = clientSlice.actions;

// Export reducer
export default clientSlice.reducer;
