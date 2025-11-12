import { Request, ResponseToolkit } from '@hapi/hapi';
import { z, ZodRawShape } from 'zod';
export declare const validate: (schema: z.ZodObject<ZodRawShape>) => (request: Request, h: ResponseToolkit) => Promise<symbol | import("@hapi/hapi").ResponseObject>;
