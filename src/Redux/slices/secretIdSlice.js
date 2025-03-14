import { createSlice } from '@reduxjs/toolkit';
import { dummyData } from '@/data/clientIdsDummyData';

const initialState = {
    clientId: dummyData.clientId,
    clientSecret: dummyData.clientSecret,
    isEditing: false,
};

const clientSlice = createSlice({
    name: 'clientIdsSet',
    initialState,
    reducers: {
        setClientData: (state, action) => {
            state.clientId = action.payload.clientId;
            state.clientSecret = action.payload.clientSecret;
        },
        setIsEditing: (state, action) => {
            state.isEditing = action.payload;
        }
    }
});

export const { setClientData, setIsEditing } = clientSlice.actions;
export default clientSlice.reducer;