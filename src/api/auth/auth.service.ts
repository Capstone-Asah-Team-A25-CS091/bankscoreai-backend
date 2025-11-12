import {
  createUser,
  findUserByEmail,
  updateUserPassword,
  findUserById,
} from "../../models/user";
import { comparePassword } from "../../utils/password";
import { createToken } from "../../utils/jwt";

export const register = async (
  email: string,
  password: string,
  name: string
) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("Pengguna sudah ada");
  }
  const user = await createUser(email, password, name);
  const token = createToken({ id: user.id });
  return { user, token };
};

export const login = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Kredensial tidak valid");
  }
  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error("Kredensial tidak valid");
  }
  const token = createToken({ id: user.id });
  return { user, token };
};

export const updatePassword = async (
  id: number,
  oldPassword: string,
  newPassword: string
) => {
  const user = await findUserById(id);
  if (!user) {
    throw new Error("Pengguna tidak ditemukan");
  }

  const isPasswordValid = await comparePassword(
    oldPassword,
    user.password_hash
  );
  if (!isPasswordValid) {
    throw new Error("Kata sandi lama tidak valid");
  }

  await updateUserPassword(id, newPassword);
};
