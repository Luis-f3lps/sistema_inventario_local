import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'ytf.h.filess.io', // O host do banco de dados
  user: process.env.DB_USER || 'sistemaLab_jethalfway', // Nome do usuário
  password: process.env.DB_PASSWORD || 'c8e375b482c025245599e5abb70c2fda7acfeb33', // Senha do usuário
  database: process.env.DB_NAME || 'sistemaLab_jethalfway', // Nome do banco de dados
  port: process.env.DB_PORT || 3307, // Porta do banco de dados
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 3
});

export default pool;
