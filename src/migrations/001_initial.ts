
import pool from '../db';

const up = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL
    );
  `);
};

const down = async () => {
  await pool.query('DROP TABLE IF EXISTS users;');
};

// For running migrations from the command line
if (require.main === module) {
  const direction = process.argv[2];
  if (direction === 'up') {
    up();
  } else if (direction === 'down') {
    down();
  }
}
