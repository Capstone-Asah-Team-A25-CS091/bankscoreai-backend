import { User } from "../types";
export declare const createUser: (email: string, password: string, name: string) => Promise<User>;
export declare const findUserByEmail: (email: string) => Promise<User | null>;
export declare const findUserById: (id: number) => Promise<User | null>;
export declare const updateUserPassword: (id: number, password: string) => Promise<void>;
