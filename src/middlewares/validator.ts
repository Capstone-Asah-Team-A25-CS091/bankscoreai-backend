import { Request, ResponseToolkit } from '@hapi/hapi';
import { z, ZodError, ZodRawShape } from 'zod';

export const validate =
  (schema: z.ZodObject<ZodRawShape>) =>
  async (request: Request, h: ResponseToolkit) => {
    try {
      schema.parse({
        body: request.payload,
        query: request.query,
        params: request.params,
      });
      return h.continue;
    } catch (error) {
      if (error instanceof ZodError) {
        return h.response({ errors: error.issues }).code(400).takeover();
      }
      return h.response({ message: 'Internal Server Error' }).code(500).takeover();
    }
  };