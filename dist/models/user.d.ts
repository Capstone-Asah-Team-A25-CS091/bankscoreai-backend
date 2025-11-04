export interface User {
    id: number;
    email: string;
    password_hash: string;
    name: string;
    created_at: Date;
    updated_at: Date;
}
export declare const createUser: (email: string, password: string, name: string) => Promise<User>;
export declare const findUserByEmail: (email: string) => Promise<User | null>;
export declare const findUserById: (id: number) => Promise<User | null>;
export declare const updateUserPassword: (id: number, password: string) => Promise<void>;
