// store.js
import { configureStore } from '@reduxjs/toolkit';
import materialTailwindReducer from '@/Redux/slices/materialTailwindSlice';
import userReducer from '@/Redux/slices/User.Slice';
import clientReducer from '@/Redux/slices/secretIdSlice';
import contactReducer from '@/Redux/slices/Contact.slice'
import displaycfieldsReducer from '@/Redux/slices/customfieldslice';
import galleryReducer from '@/Redux/slices/Gallery.slice'
const store = configureStore({
    reducer: {
        user: userReducer,
        clientIdsSet: clientReducer,
        contacts: contactReducer,
        displaycfields: displaycfieldsReducer,
        gallery: galleryReducer
    },
});

export default store;
