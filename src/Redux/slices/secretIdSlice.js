import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dummyData } from '@/data/clientIdsDummyData';

export const clientSettings = createAsyncThunk('client/settings', async ({ clientId, clientSecret }) => {
    console.log("Editing user with ID:", clientId, "clientSecret:", clientSecret);
    // const response = await editUser(id, userData);
    console.log(response)
    return response; // Assuming this returns the updated user
});

const initialState = {
    clientId: dummyData.clientId,
    clientSecret: dummyData.clientSecret,
    isEditing: false,
    error: null,
};

const clientSlice = createSlice({
    name: 'clientIdsSet',
    initialState,
    reducers: {
        setIsEditing: (state, action) => {
            state.isEditing = action.payload;
        },
        setClientData: (state, action) => {
            state.clientId = action.payload.clientId;
            state.clientSecret = action.payload.clientSecret;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch users
            .addCase(clientSettings.pending, (state) => {
                state.isEditing = true;
                state.error = null;
            })
            .addCase(clientSettings.fulfilled, (state, action) => {
                state.isEditing = false;
                state.error = null;
            })
            .addCase(clientSettings.rejected, (state, action) => {
                state.isEditing = false;
                state.error = action.error.message; // Set the error message
            })
    },
});

export const { setIsEditing, setClientData } = clientSlice.actions;
export default clientSlice.reducer;