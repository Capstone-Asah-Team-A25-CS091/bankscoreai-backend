export declare const register: (email: string, password: string, name: string) => Promise<{
    user: import("../../types").User;
    token: string;
}>;
export declare const login: (email: string, password: string) => Promise<{
    user: import("../../types").User;
    token: string;
}>;
export declare const updatePassword: (id: number, oldPassword: string, newPassword: string) => Promise<void>;
