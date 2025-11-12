"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPassword = exports.findUserById = exports.findUserByEmail = exports.createUser = void 0;
const db_1 = __importDefault(require("../db"));
const password_1 = require("../utils/password");
const createUser = async (email, password, name) => {
    const passwordHash = await (0, password_1.hashPassword)(password);
    const result = await db_1.default.query("INSERT INTO users (email, password_hash, name, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *", [email, passwordHash, name]);
    return result.rows[0];
};
exports.createUser = createUser;
const findUserByEmail = async (email) => {
    const result = await db_1.default.query("SELECT * FROM users WHERE email = $1", [
        email,
    ]);
    return result.rows[0] || null;
};
exports.findUserByEmail = findUserByEmail;
const findUserById = async (id) => {
    const result = await db_1.default.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] || null;
};
exports.findUserById = findUserById;
const updateUserPassword = async (id, password) => {
    const passwordHash = await (0, password_1.hashPassword)(password);
    await db_1.default.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
        passwordHash,
        id,
    ]);
};
exports.updateUserPassword = updateUserPassword;
//# sourceMappingURL=user.js.map