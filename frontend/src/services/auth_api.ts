import { axiosInstance } from "./instance";
import { LoginResponse, LoginRequest, RegisterResponse, RefreshResponse } from "../types/auth_types"

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await axiosInstance.post("auth/login/", data);
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}

export const logout = async (refreshToken:string): Promise<string> => {
    try {
        const response = await axiosInstance.post("auth/logout/",refreshToken);
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
}

// export const refreshToken = async (): Promise<string> => {
//     try {
//         const response = await axiosInstance.post("token/refresh/");
//         console.log("Response data:", response.data);
//         return response.data;
//     } catch (error) {
//         console.error("Error logging out:", error);
//         throw error;
//     }
// }