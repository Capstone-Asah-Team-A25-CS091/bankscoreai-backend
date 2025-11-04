"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.login = exports.register = void 0;
const user_1 = require("../../models/user");
const password_1 = require("../../utils/password");
const jwt_1 = require("../../utils/jwt");
const register = async (email, password, name) => {
    const existingUser = await (0, user_1.findUserByEmail)(email);
    if (existingUser) {
        throw new Error('User already exists');
    }
    const user = await (0, user_1.createUser)(email, password, name);
    const token = (0, jwt_1.createToken)({ id: user.id });
    return { user, token };
};
exports.register = register;
const login = async (email, password) => {
    const user = await (0, user_1.findUserByEmail)(email);
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const isPasswordValid = await (0, password_1.comparePassword)(password, user.password_hash);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }
    const token = (0, jwt_1.createToken)({ id: user.id });
    return { user, token };
};
exports.login = login;
const updatePassword = async (id, oldPassword, newPassword) => {
    const user = await (0, user_1.findUserById)(id);
    if (!user) {
        throw new Error('User not found');
    }
    const isPasswordValid = await (0, password_1.comparePassword)(oldPassword, user.password_hash);
    if (!isPasswordValid) {
        throw new Error('Invalid old password');
    }
    await (0, user_1.updateUserPassword)(id, newPassword);
};
exports.updatePassword = updatePassword;
//# sourceMappingURL=auth.service.js.map