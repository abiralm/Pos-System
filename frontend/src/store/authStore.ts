import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as loginApi, logout as logoutApi } from "../services/auth_api";
import { User } from "../types/auth_types";

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;

    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setTokens: (access: string, refresh: string) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            login: async (username, password) => {
                const data = await loginApi({ username, password });
                set({
                    user: data.user,
                    accessToken: data.access,
                    refreshToken: data.refresh,
                    isAuthenticated: true,
                });
            },

            logout: async () => {
                const { refreshToken } = get();
                if (refreshToken) {
                    try {
                        await logoutApi(refreshToken);
                    } catch (_) {}
                }
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });
            },

            setTokens: (access, refresh) => {
                set({ accessToken: access, refreshToken: refresh, isAuthenticated: true });
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);