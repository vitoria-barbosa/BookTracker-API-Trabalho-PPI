import pool from "../database";
import { SessaoLeitura } from "../entities";
import { LivroService } from "./livroService";

export class SessaoLeituraService {
  private livroService = new LivroService();

  async adicionarSessao(
    sessao: SessaoLeitura,
    idLivro: number,
  ): Promise<SessaoLeitura | null> {
    const livro = await this.livroService.buscarLivroPeloId(idLivro);

    if (!livro) {
      return null;
    }

    if (livro.comecouEm === null) {
      await this.livroService.comecarLivro(livro.id);
    }

    if (livro.terminouEm !== null) {
      throw new Error(
        "Não é possível adicionar mais sessões de leitura para esse livro, pois já foi terminado.",
      );
    }

    const dataDeHoje = new Date();
    const valores = [idLivro, sessao.qtdPaginas, sessao.comentario, dataDeHoje];

    const res = await pool.query(
      `INSERT INTO SESSAO_LEITURA(id_livro, qtd_paginas, comentario, data_sessao) VALUES ($1, $2, $3, $4) 
      RETURNING id, id_livro as "idLivro", qtd_paginas as "qtdPaginas", comentario, data_sessao as "dataSessao"`,
      valores,
    );

    return res.rows[0] as SessaoLeitura;
  }

  async buscarTodasAsSessoes(): Promise<SessaoLeitura[]> {
    const res = await pool.query(
      `SELECT id, id_livro as "idLivro", qtd_paginas as "qtdPaginas", comentario, data_sessao as "dataSessao"
       FROM SESSAO_LEITURA ORDER BY data_sessao DESC`,
    );

    return res.rows as SessaoLeitura[];
  }

  async buscarSessoesPeloLivro(idLivro: number): Promise<SessaoLeitura[]> {
    const res = await pool.query(
      `SELECT id, id_livro as "idLivro", qtd_paginas as "qtdPaginas", comentario, data_sessao as "dataSessao"
       FROM SESSAO_LEITURA WHERE ID_LIVRO = $1 ORDER BY data_sessao DESC`,
      [idLivro],
    );

    return res.rows as SessaoLeitura[];
  }

  async buscarSessaoPeloId(id: number): Promise<SessaoLeitura | null> {
    const res = await pool.query(
      `SELECT id, id_livro as "idLivro", qtd_paginas as "qtdPaginas", comentario, data_sessao as "dataSessao" 
      FROM SESSAO_LEITURA WHERE ID = $1`,
      [id],
    );

    if (res.rowCount === 0) {
      return null;
    }

    return res.rows[0] as SessaoLeitura;
  }

  async editarComentarioOuQtdPaginasDaSessao(
    sessao: Partial<SessaoLeitura>,
    id: number,
  ): Promise<SessaoLeitura | null> {
    const camposParaAtualizar = [];
    const valores = [];
    let contadorParametros = 1;

    if (sessao.qtdPaginas !== undefined) {
      camposParaAtualizar.push(`qtd_paginas = $${contadorParametros}`);
      valores.push(sessao.qtdPaginas);
      contadorParametros++;
    }

    if (sessao.comentario !== undefined) {
      camposParaAtualizar.push(`comentario = $${contadorParametros}`);
      valores.push(sessao.comentario);
      contadorParametros++;
    }

    if (camposParaAtualizar.length === 0) {
      throw new Error(
        "Nenhum dado válido (quantidade de páginas ou comentário) foi enviado para atualização.",
      );
    }
    valores.push(id);
    const query = `
      UPDATE SESSAO_LEITURA 
      SET ${camposParaAtualizar.join(", ")} 
      WHERE ID = $${contadorParametros}
      RETURNING id, id_livro as "idLivro", qtd_paginas as "qtdPaginas", comentario, data_sessao as "dataSessao"
    `;
    ("");
    const res = await pool.query(query, valores);

    if (res.rowCount === 0) {
      return null;
    }

    return res.rows[0] as SessaoLeitura;
  }

  async deletarSessao(id: number): Promise<boolean> {
    const res = await pool.query("DELETE FROM SESSAO_LEITURA WHERE ID = $1", [
      id,
    ]);

    return res.rowCount !== 0;
  }
}
