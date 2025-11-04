import { Request, ResponseToolkit } from '@hapi/hapi';
export declare const register: (request: Request, h: ResponseToolkit) => Promise<import("@hapi/hapi").ResponseObject>;
export declare const login: (request: Request, h: ResponseToolkit) => Promise<import("@hapi/hapi").ResponseObject>;
export declare const updatePassword: (request: Request, h: ResponseToolkit) => Promise<import("@hapi/hapi").ResponseObject>;
