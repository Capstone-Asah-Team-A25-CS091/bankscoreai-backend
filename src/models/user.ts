import pool from "../db";
import { User } from "../types";
import { hashPassword } from "../utils/password";

export const createUser = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  const passwordHash = await hashPassword(password);
  const result = await pool.query(
    "INSERT INTO users (email, password_hash, name, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *",
    [email, passwordHash, name]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0] || null;
};

export const findUserById = async (id: number): Promise<User | null> => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0] || null;
};

export const updateUserPassword = async (
  id: number,
  password: string
): Promise<void> => {
  const passwordHash = await hashPassword(password);
  await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
    passwordHash,
    id,
  ]);
};
