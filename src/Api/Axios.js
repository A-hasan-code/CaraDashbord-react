import axios from 'axios';

const BASE_URL = 'https://caradashboard-backend-production.up.railway.app/api/v1';

const Axios = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        mode: "no-cors",
    },
    //  withCredentials: true,  // This enables credentials (cookies) to be sent with the requests
});

// Interceptor to attach token to every request
Axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default Axios;

// Handle responses globally, for example, logging out the user if the token is expired
// Axios.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response && error.response.status === 401) {
//             // If the token is expired or invalid, log the user out
//             localStorage.removeItem('token');
//             // Redirect to login or perform necessary actions
//         }
//         return Promise.reject(error);
//     }
// );


// export const updateUserProfile = (formData) => {
//     return axios.post(`${BASE_URL}/profile`, formData, {
//         headers: {
//             'Content-Type': 'multipart/form-data',
//             // You can also add authorization headers if necessary
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//     })
//         .then(response => response.data)
//         .catch(error => {
//             throw error.response ? error.response.data : error;
//         });
// };