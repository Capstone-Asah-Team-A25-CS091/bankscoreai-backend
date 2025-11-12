import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password minimal harus 6 karakter"),
    name: z.string(),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const updatePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string(),
    newPassword: z.string().min(6, "Password minimal harus 6 karakter"),
  }),
});

export type RegisterPayload = z.infer<typeof createUserSchema.shape.body>;
export type LoginPayload = z.infer<typeof loginUserSchema.shape.body>;
export type UpdatePasswordPayload = z.infer<
  typeof updatePasswordSchema.shape.body
>;
