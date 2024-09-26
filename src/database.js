import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,         // As variáveis já estão na Vercel
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306, // Certifique-se de usar a porta correta
  waitForConnections: true,
  connectionLimit: 10,               // Limite de conexões simultâneas
  queueLimit: 0                      // Sem limite de filas de espera
});

export default pool;
