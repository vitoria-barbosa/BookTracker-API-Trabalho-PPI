import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error(
      "Erro ao conectar ao banco de dados PostgreSQL:",
      err.stack,
    );
  }
  console.log(
    "Conexão com o banco de dados PostgreSQL estabelecida com sucesso!",
  );
  release();
});

export default pool;
