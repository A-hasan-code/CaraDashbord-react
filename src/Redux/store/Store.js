// store.js
import { configureStore } from '@reduxjs/toolkit';
import materialTailwindReducer from '@/Redux/slices/materialTailwindSlice';
import userReducer from '@/Redux/slices/User.Slice'
import authReducer from '@/Redux/slices/authslices'
import clientReducer from '@/Redux/slices/secretIdSlice'
const store = configureStore({
    reducer: {
        materialTailwind: materialTailwindReducer,
        user: userReducer,
        auth: authReducer,
        clientIdsSet: clientReducer,
    },
});

export default store;
