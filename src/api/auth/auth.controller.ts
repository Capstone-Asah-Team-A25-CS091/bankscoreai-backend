import { Request, ResponseToolkit } from '@hapi/hapi';
import * as authService from './auth.service';
import {
  LoginPayload,
  RegisterPayload,
  UpdatePasswordPayload,
} from './auth.validation';

export const register = async (request: Request, h: ResponseToolkit) => {
  try {
    const { email, password, name } = request.payload as RegisterPayload;
    const { user, token } = await authService.register(email, password, name);
    return h
      .response({
        status: 'success',
        code: 201,
        data: { user, token },
      })
      .code(201);
  } catch (error) {
    if (error instanceof Error) {
      return h
        .response({
          status: 'fail',
          code: 400,
          message: error.message,
        })
        .code(400);
    }
    return h
      .response({
        status: 'fail',
        code: 500,
        message: 'An unknown error occurred',
      })
      .code(500);
  }
};

export const login = async (request: Request, h: ResponseToolkit) => {
  try {
    const { email, password } = request.payload as LoginPayload;
    const { user, token } = await authService.login(email, password);
    return h
      .response({
        status: 'success',
        code: 200,
        data: { user, token },
      })
      .code(200);
  } catch (error) {
    if (error instanceof Error) {
      return h
        .response({
          status: 'fail',
          code: 400,
          message: error.message,
        })
        .code(400);
    }
    return h
      .response({
        status: 'fail',
        code: 500,
        message: 'An unknown error occurred',
      })
      .code(500);
  }
};

export const updatePassword = async (request: Request, h: ResponseToolkit) => {
  try {
    const { oldPassword, newPassword } =
      request.payload as UpdatePasswordPayload;

    const userId = request.auth.credentials.id ;

    if (!userId) {
      return h
        .response({
          status: 'fail',
          code: 401,
          message: 'Unauthorized',
        })
        .code(401);
    }
    await authService.updatePassword(userId, oldPassword, newPassword);
    return h
      .response({
        status: 'success',
        code: 200,
        message: 'Kata sandi berhasil diperbarui',
      })
      .code(200);
  } catch (error) {
    if (error instanceof Error) {
      return h
        .response({
          status: 'fail',
          code: 400,
          message: error.message,
        })
        .code(400);
    }
    return h
      .response({
        status: 'fail',
        code: 500,
        message: 'An unknown error occurred',
      })
      .code(500);
  }
};

