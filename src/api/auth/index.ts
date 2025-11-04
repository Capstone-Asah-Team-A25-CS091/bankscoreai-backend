
import { Router } from 'express';
import * as authController from './auth.controller';
import { validate } from '../../middlewares/validator';
import { authenticate } from '../../middlewares/auth';
import {
  createUserSchema,
  loginUserSchema,
  updatePasswordSchema,
} from './auth.validation';

const router = Router();

router.post(
  '/register',
  validate(createUserSchema),
  authController.register
);
router.post('/login', validate(loginUserSchema), authController.login);
router.put(
  '/password',
  authenticate,
  validate(updatePasswordSchema),
  authController.updatePassword
);

export default router;
