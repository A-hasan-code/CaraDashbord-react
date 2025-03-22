// redux/contactSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getContactsByLocation } from '@/Api/contactapi';  

// Create an async thunk to handle the contact fetch action
export const fetchContacts = createAsyncThunk(
    'contacts/fetchContacts',
    async () => {
        const contacts = await getContactsByLocation();
        return contacts;
    }
);

// Slice to handle contacts state
const contactSlice = createSlice({
    name: 'contacts',
    initialState: {
        contacts: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchContacts.pending, (state) => {
                state.loading = true;  // Show loading indicator
            })
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.loading = false;
                state.contacts = action.payload;  // Store fetched contacts
            })
            .addCase(fetchContacts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;  // Store error message if request fails
            });
    },
});

export default contactSlice.reducer;
