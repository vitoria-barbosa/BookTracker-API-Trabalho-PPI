import { Request, Response } from "express";
import { SessaoLeituraService } from "../services/sessaoLeituraService";

export class SessaoLeituraController {
  private sessaoLeituraService = new SessaoLeituraService();

  adicionarSessao = async (req: Request, res: Response) => {
    try {
      const idLivro = Number(req.params.idLivro);
      const sessao = await this.sessaoLeituraService.adicionarSessao(
        req.body,
        idLivro,
      );

      if (!sessao) {
        return res
          .status(404)
          .json({ erro: "Não existe um livro com esse ID." });
      }
      return res.status(201).json(sessao);
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  };

  buscarSessoesDeUmLivro = async (req: Request, res: Response) => {
    try {
      const idLivro = Number(req.params.idLivro);
      const sessaoDeLeitura =
        await this.sessaoLeituraService.buscarSessoesPeloLivro(idLivro);

      return res.status(200).json(sessaoDeLeitura);
    } catch (error: any) {
      res.status(500).json({
        erro:
          "Erro ao buscar as sessões de leitura cadastradas. " + error.message,
      });
    }
  };

  buscarSessao = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const sessaoDeLeitura =
        await this.sessaoLeituraService.buscarSessaoPeloId(id);

      if (!sessaoDeLeitura) {
        return res
          .status(404)
          .json({ erro: "Não existe uma sessão de leitura com esse ID." });
      }

      return res.status(200).json(sessaoDeLeitura);
    } catch (error: any) {
      res
        .status(500)
        .json({ erro: "Erro ao buscar sessão de leitura. " + error.message });
    }
  };

  atualizarSessao = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const sessaoDeLeitura =
        await this.sessaoLeituraService.editarComentarioOuQtdPaginasDaSessao(
          req.body,
          id,
        );

      if (!sessaoDeLeitura) {
        return res
          .status(404)
          .json({ erro: "Não existe uma sessão de leitura com esse ID." });
      }
      return res.status(200).json(sessaoDeLeitura);
    } catch (error: any) {
      res.status(400).json({
        erro: "Erro ao atualizar sessão de leitura. " + error.message,
      });
    }
  };

  deletarSessao = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const existe = await this.sessaoLeituraService.deletarSessao(id);

      if (!existe) {
        return res
          .status(404)
          .json({ erro: "Não existe uma sessão de leitura com esse ID." });
      }
      return res.status(204).send();
    } catch (error: any) {
      res
        .status(500)
        .json({ erro: "Erro ao deletar sessão de leitura. " + error.message });
    }
  };
}
