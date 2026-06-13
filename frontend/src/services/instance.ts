import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach token on every request
axiosInstance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto-refresh on 401
let isRefreshing = false;
let queue: Array<{ resolve: (token: string) => void; reject: () => void }> = [];

axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    queue.push({ resolve, reject });
                }).then((token) => {
                    original.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(original);
                });
            }

            isRefreshing = true;
            const { refreshToken, setTokens, logout } = useAuthStore.getState();

            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/token/refresh/`,
                    { refresh: refreshToken }
                );
                const newAccess: string = res.data.access;
                setTokens(newAccess, refreshToken!);

                queue.forEach((p) => p.resolve(newAccess));
                queue = [];

                original.headers.Authorization = `Bearer ${newAccess}`;
                return axiosInstance(original);
            } catch {
                queue.forEach((p) => p.reject());
                queue = [];
                logout();
                window.location.href = "/login";
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);