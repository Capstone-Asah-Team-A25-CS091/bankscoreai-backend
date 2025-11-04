
import * as Hapi from '@hapi/hapi';
import * as authController from './auth.controller';
import { validate } from '../../middlewares/validator';
import {
  createUserSchema,
  loginUserSchema,
  updatePasswordSchema,
} from './auth.validation';

const authRoutes: Hapi.ServerRoute[] = [
  {
    method: 'POST',
    path: '/api/auth/register',
    handler: authController.register,
    options: {
      pre: [{ method: validate(createUserSchema), assign: 'payload' }],
    },
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    handler: authController.login,
    options: {
      pre: [{ method: validate(loginUserSchema), assign: 'payload' }],
    },
  },
  {
    method: 'PUT',
    path: '/api/auth/password',
    handler: authController.updatePassword,
    options: {
      auth: 'jwt-auth',
      pre: [
        { method: validate(updatePasswordSchema), assign: 'payload' },
      ],
    },
  },
];

export default authRoutes;
