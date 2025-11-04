"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
const createToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, jwtSecret, { expiresIn: '1h' });
};
exports.createToken = createToken;
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, jwtSecret);
    }
    catch (error) {
        return 'Invalid token';
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.js.map