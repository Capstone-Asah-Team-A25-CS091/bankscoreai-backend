import { Request, ResponseToolkit, Server } from '@hapi/hapi';
import { verifyToken } from '../utils/jwt';

declare module '@hapi/hapi' {
  interface AuthCredentials {
    id: string;
  }
}

export const authPlugin = {
  name: 'auth',
  version: '1.0.0',
  register: async (server: Server) => {
    server.auth.scheme('jwt', () => ({
      authenticate: async (request: Request, h: ResponseToolkit) => {
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
          return h.unauthenticated(new Error('Missing authentication'));
        }

        const decoded = verifyToken(token);

        if (typeof decoded === 'string') {
          return h.unauthenticated(new Error(decoded));
        }

        return h.authenticated({ credentials: decoded as { id: string } });
      },
    }));

    server.auth.strategy('jwt-auth', 'jwt');
  },
};