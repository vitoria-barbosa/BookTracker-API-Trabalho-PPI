import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
