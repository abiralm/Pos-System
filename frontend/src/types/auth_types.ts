export type User = {
    id: string;
    username: string;
    role: "admin" | "visitor";
}

export type LoginResponse = {
    access: string;
    refresh: string;
    user: User;
}

export type LoginRequest = {
    username: string,
    password: string
}

export type RegisterResponse = {
    message: string;
    user: User;
}

export type RefreshResponse = {
    access: string;
}