
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

export const createToken = (payload: object): string => {
  return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
};

export const verifyToken = (token: string): object | string => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    return 'Invalid token';
  }
};
