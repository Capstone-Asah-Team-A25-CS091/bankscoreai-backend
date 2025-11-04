import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { z } from 'zod';

export const validate = (
  schema: z.ZodObject<any, any>
) => async (request: Request, h: ResponseToolkit) => {
  try {
    schema.parse({
      body: request.payload,
      query: request.query,
      params: request.params,
    });
    return h.continue;
  } catch (error: any) {
    return h.response({ errors: error.errors }).code(400).takeover();
  }
};