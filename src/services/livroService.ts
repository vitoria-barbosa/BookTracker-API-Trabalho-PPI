import pool from "../database";
import { Livro } from "../entities";

export class LivroService {
  async adicionarLivro(livro: Livro): Promise<Livro> {
    const valores = [livro.titulo, livro.autor, livro.genero, livro.qtdPaginas];
    const res = await pool.query(
      `INSERT INTO LIVRO(titulo, autor, genero, qtd_paginas) VALUES ($1, $2, $3, $4) 
      RETURNING id, titulo, autor, genero, qtd_paginas as "qtdPaginas", 
      comecou_em as "comecouEm", terminou_em as "terminouEm", nota, opiniao`,
      valores,
    );

    return res.rows[0] as Livro;
  }

  async buscarLivros(titulo?: string): Promise<Livro[]> {
    if (!titulo) {
      const res = await pool.query(
        `SELECT id, titulo, autor, genero, qtd_paginas as "qtdPaginas", 
        comecou_em as "comecouEm", terminou_em as "terminouEm", nota, opiniao 
        FROM LIVRO`,
      );

      return res.rows as Livro[];
    }

    const res = await pool.query(
      `SELECT id, titulo, autor, genero, qtd_paginas as "qtdPaginas", 
      comecou_em as "comecouEm", terminou_em as "terminouEm", nota, opiniao 
      FROM LIVRO WHERE titulo ILIKE $1`,
      [`%${titulo}%`],
    );

    return res.rows as Livro[];
  }

  async buscarLivroPeloId(id: number): Promise<Livro | null> {
    const res = await pool.query(
      `SELECT id, titulo, autor, genero, qtd_paginas as "qtdPaginas", 
      comecou_em as "comecouEm", terminou_em as "terminouEm", nota, opiniao 
      FROM LIVRO WHERE ID = $1`,
      [id],
    );

    if (res.rowCount === 0) {
      return null;
    }

    return res.rows[0] as Livro;
  }

  async comecarLivro(id: number): Promise<void> {
    const dataDeHoje = new Date();

    pool.query("UPDATE LIVRO SET comecou_em = $1 WHERE ID = $2", [
      dataDeHoje,
      id,
    ]);
  }

  async editarLivro(livro: Livro, id: number): Promise<Livro | null> {
    if (livro.terminouEm === undefined) {
      throw new Error(
        "Ao finalizar uma leitura é obrigatório passar a data do término.",
      );
    }

    const valores = [livro.terminouEm, livro.nota, livro.opiniao, id];
    const res = await pool.query(
      `UPDATE LIVRO SET terminou_em = $1, nota = $2, opiniao = $3 WHERE ID = $4 
      RETURNING id, titulo, autor, genero, qtd_paginas as "qtdPaginas", 
      comecou_em as "comecouEm", terminou_em as "terminouEm", nota, opiniao`,
      valores,
    );

    if (res.rowCount === 0) {
      return null;
    }

    return res.rows[0] as Livro;
  }

  async deletarLivro(id: number): Promise<boolean> {
    const res = await pool.query("DELETE FROM LIVRO WHERE ID = $1", [id]);

    return res.rowCount !== 0;
  }
}
