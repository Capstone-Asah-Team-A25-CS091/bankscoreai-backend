import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { z } from 'zod';
export declare const validate: (schema: z.ZodObject<any, any>) => (request: Request, h: ResponseToolkit) => Promise<symbol | ResponseObject>;
