import axios from "axios";

const Baseurl = axios.create({
    baseURL: "https://caradashboard-backend-production.up.railway.app/api/v1", // fallback for dev
    // withCredentials: true, // optional: for cookies/session if needed
});
Baseurl.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
export default Baseurl;
