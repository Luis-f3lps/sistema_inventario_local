import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool;

async function initializeDatabase() {
  try {
    console.log("Database Host:", process.env.DB_HOST);
    console.log("Database Port:", process.env.DB_PORT);
    console.log("Database User:", process.env.DB_USER);
    console.log("Database Name:", process.env.DB_NAME);

    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 10, // Ajuste conforme necessário
      waitForConnections: true,
      queueLimit: 0
    });

    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    console.log('Connected to MySQL database!', rows);

  } catch (error) {
    console.error('Failed to connect to MySQL database:', error);
    throw error;
  }
}

initializeDatabase();

export { pool };
