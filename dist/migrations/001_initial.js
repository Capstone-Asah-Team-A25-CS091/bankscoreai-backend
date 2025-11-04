"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const up = async () => {
    await db_1.default.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL
    );
  `);
};
const down = async () => {
    await db_1.default.query('DROP TABLE IF EXISTS users;');
};
// For running migrations from the command line
if (require.main === module) {
    const direction = process.argv[2];
    if (direction === 'up') {
        up();
    }
    else if (direction === 'down') {
        down();
    }
}
//# sourceMappingURL=001_initial.js.map