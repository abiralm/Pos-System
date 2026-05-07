
import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
})


// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("access_token");
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );