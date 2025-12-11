import * as dotenv from "dotenv";
dotenv.config();
import pool from "./db";

const runMigrations = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
    await client.query(`
            CREATE TABLE IF NOT EXISTS credit_applications (
                id SERIAL PRIMARY KEY,
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                age INTEGER,
                job VARCHAR(256),
                marital VARCHAR(256),
                education VARCHAR(256),
                has_credit_in_default VARCHAR(256),
                balance INTEGER,
                housing VARCHAR(256),
                loan VARCHAR(256),
                contact VARCHAR(256),
                month VARCHAR(256),
                day_of_week VARCHAR(256),
                duration INTEGER,
                campaign INTEGER,
                pdays INTEGER,
                previous INTEGER,
                poutcome VARCHAR(256),
                emp_var_rate REAL,
                cons_price_idx REAL,
                cons_conf_idx REAL,
                euribor3m REAL,
                nr_employed REAL,
                y VARCHAR(10),
                prediction_result VARCHAR(10),
                prediction_probability REAL,
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
