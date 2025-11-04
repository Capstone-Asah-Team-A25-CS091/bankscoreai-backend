export declare const register: (email: string, password: string, name: string) => Promise<{
    user: import("../models/user").User;
    token: string;
}>;
export declare const login: (email: string, password: string) => Promise<{
    user: import("../models/user").User;
    token: string;
}>;
export declare const updatePassword: (id: number, oldPassword: string, newPassword: string) => Promise<void>;
