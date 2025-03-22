// api/contactApi.js
import Axios from '../Api/Axios';  // Import your custom Axios instance

// Function to fetch contacts by location
export const getContactsByLocation = async () => {
    try {
        const response = await Axios.get('/contactsall');
        return response.data.contacts;  // Assuming the response has contacts
    } catch (error) {
        console.error('Error fetching contacts:', error);
        throw error;
    }
};
export const getCustomFields = async () => {
    try {
        const response = await Axios.get('/displaycfields');  
        console.log("Custom Fields: ", response.data);
        return response.data;  
    } catch (error) {
        console.error('Error fetching custom fields:', error);
        
        throw new Error('There was an issue fetching the custom fields.');
    }
};
export const updateDisplaySetting = async (displaySettingData) => {
    try {
        const response = await Axios.post('/displaysetting', displaySettingData); 
        return response.data;  
    } catch (error) {
        console.error('Error updating display settings:', error);
        throw error;  
    }
};