import { Request, ResponseToolkit } from '@hapi/hapi';
import * as authService from './auth.service';

export const register = async (request: Request, h: ResponseToolkit) => {
  try {
    const { email, password, name } = request.payload as any;
    const { user, token } = await authService.register(email, password, name);
    return h.response({ user, token }).code(201);
  } catch (error: any) {
    return h.response({ message: error.message }).code(400);
  }
};

export const login = async (request: Request, h: ResponseToolkit) => {
  try {
    const { email, password } = request.payload as any;
    const { user, token } = await authService.login(email, password);
    return h.response({ user, token }).code(200);
  } catch (error: any) {
    return h.response({ message: error.message }).code(400);
  }
};

export const updatePassword = async (request: Request, h: ResponseToolkit) => {
  try {
    const { oldPassword, newPassword } = request.payload as any;
    // In Hapi, user information from authentication strategy would be available via request.auth.credentials
    // For now, we'll assume a placeholder for userId
    const userId = request.auth.credentials.id;

    if (!userId) {
      return h.response({ message: 'Unauthorized' }).code(401);
    }
    await authService.updatePassword(userId, oldPassword, newPassword);
    return h.response({ message: 'Password updated successfully' }).code(200);
  } catch (error: any) {
    return h.response({ message: error.message }).code(400);
  }
};