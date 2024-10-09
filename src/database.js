import mysql from 'mysql2/promise';

// Criação da pool de conexões com o banco de dados MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST, // O host do banco de dados
  user: process.env.DB_USER, // Nome do usuário
  password: process.env.DB_PASSWORD, // Senha do usuário
  database: process.env.DB_NAME, // Nome do banco de dados
  port: process.env.DB_PORT, // Porta do banco de dados (opcional, padrão 3306)
  waitForConnections: true, // Espera por conexões disponíveis
  connectionLimit: 10, // Limite de conexões na pool
  queueLimit: 3 // Limite de conexões na fila
});

// Exporta a pool para uso em outras partes da aplicação
export default pool;
