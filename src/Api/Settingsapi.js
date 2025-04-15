import Axios from '@/Api/Axios';
import { toast } from 'react-toastify';
// Fetch settings from the server
export const getSettings = async () => {
    try {
        const response = await Axios.get('/settings');
        const settings = response.data;

        // Map through the settings to find the client_id and client_secret
        const clientId = settings.find(item => item.key === 'clientId')?.value;
        const clientSecret = settings.find(item => item.key === 'clientSecret')?.value;



        // You can return or use clientId and clientSecret as needed
        return { clientId, clientSecret };
    } catch (error) {
        const errorMessage = error.response?.data?.message;
        console.error('Error fetching settings:', errorMessage);
        throw new Error(errorMessage);
    }

};


// Save settings to the server
export const saveSettings = async (data) => {
    try {
        const response = await Axios.post('/settings', { settings: data });
     
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error saving settings';
      
        throw new Error(errorMessage);
    }
};
export const getimage = async () => {
    try {
        const response = await Axios.get('/settings');
        const settings = response.data;

        console.log(settings)
        const logo = settings.find(item => item?.key === 'logo')?.value;
        const cover = settings.find(item => item?.key === 'cover')?.value;
        const displaycf = settings.find(item => item?.key === 'displaySetting')?.value

        // Return the retrieved values
        return { logo, cover, displaycf };
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'An error occurred while fetching settings.';
        console.error('Error fetching settings:', errorMessage);
        throw new Error(errorMessage);
    }
};
export const sync = async () => {
    try {
        const response = await Axios.get('/custom-fields');

    


        return response.data;

    } catch (error) {
        console.error('Error fetching custom fields:', error);


    }
}
export const webhook =async()=>{
    
}