// redux/displaycfieldsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCustomFields, updateDisplaySetting } from '@/Api/contactapi';   

// Async thunk to fetch custom fields
export const fetchCustomFields = createAsyncThunk(
    'displaycfields/fetchCustomFields',
    async () => {
        const customFields = await getCustomFields();
        return customFields;
    }
);

// Async thunk to update display settings
export const updateDisplaySettings = createAsyncThunk(
    'displaycfields/updateDisplaySettings',
    async (displaySettingData) => {
        const response = await updateDisplaySetting(displaySettingData);  
        return response;  
    }
);

const displaycfieldsSlice = createSlice({
    name: 'displaycfields',
    initialState: {
        customFields: [],  
        loading: false,    
        error: null,      
        settings: null,    
        settingsError: null, 
    },
    reducers: {},
    extraReducers: (builder) => {
        // Handling fetching custom fields
        builder
            .addCase(fetchCustomFields.pending, (state) => {
                state.loading = true;  // Set loading to true while fetching
            })
            .addCase(fetchCustomFields.fulfilled, (state, action) => {
                state.loading = false;
                state.customFields = action.payload;  // Store the custom fields in state
            })
            .addCase(fetchCustomFields.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;  // Store the error message
            });

        // Handling updating display settings
        builder
            .addCase(updateDisplaySettings.pending, (state) => {
                state.loading = true;  
            })
            .addCase(updateDisplaySettings.fulfilled, (state, action) => {
                state.loading = false;
                state.settings = action.payload;  
            })
            .addCase(updateDisplaySettings.rejected, (state, action) => {
                state.loading = false;
                state.settingsError = action.error.message;  
            });
    },
});

export default displaycfieldsSlice.reducer;
