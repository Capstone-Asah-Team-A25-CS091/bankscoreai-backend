import * as dotenv from "dotenv";
dotenv.config();
import pool from "./db";

const runMigrations = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
    await client.query("COMMIT");
    console.log("Migrations completed successfully.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error running migrations:", err);
    throw err;
  } finally {
    client.release();
    pool.end();
  }
};

runMigrations();
