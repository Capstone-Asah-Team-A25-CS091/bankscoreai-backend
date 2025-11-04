
import { Request, Response } from 'express';
import * as authService from './auth.service';

export interface AuthRequest extends Request {
  user?: { id: number };
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const { user, token } = await authService.register(email, password, name);
    res.status(201).json({ user, token });
  } catch (error: any) { // Explicitly type error as any
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.json({ user, token });
  } catch (error: any) { // Explicitly type error as any
    res.status(400).json({ message: error.message });
  }
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    await authService.updatePassword(userId, oldPassword, newPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (error: any) { // Explicitly type error as any
    res.status(400).json({ message: error.message });
  }
};
