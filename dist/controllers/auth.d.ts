import { Request, Response } from 'express';
export interface AuthRequest extends Request {
    user?: {
        id: number;
    };
}
export declare const register: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const updatePassword: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
