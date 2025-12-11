import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  // ! pg local
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE || 'capstone_asah',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5433,

  // ! pg serverless
  // connectionString: process.env.DB_USER,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});

export default pool;
