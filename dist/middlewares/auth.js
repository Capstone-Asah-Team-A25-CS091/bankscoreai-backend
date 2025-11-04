"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authPlugin = void 0;
const jwt_1 = require("../utils/jwt");
exports.authPlugin = {
    name: 'auth',
    version: '1.0.0',
    register: async (server) => {
        server.auth.scheme('jwt', () => ({
            authenticate: async (request, h) => {
                const token = request.headers.authorization?.split(' ')[1];
                if (!token) {
                    return h.unauthenticated(new Error('Missing authentication'));
                }
                const decoded = (0, jwt_1.verifyToken)(token);
                if (typeof decoded === 'string') {
                    return h.unauthenticated(new Error(decoded));
                }
                return h.authenticated({ credentials: decoded });
            },
        }));
        server.auth.strategy('jwt-auth', 'jwt');
    },
};
//# sourceMappingURL=auth.js.map