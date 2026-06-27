import { Request, Response } from "express";
import { LivroService } from "../services/livroService";

export class LivroController {
  private livroService = new LivroService();

  adicionarLivro = async (req: Request, res: Response) => {
    try {
      const livro = await this.livroService.adicionarLivro(req.body);
      res.status(201).json(livro);
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  };

  buscarLivros = async (req: Request, res: Response) => {
    try {
      const livros = await this.livroService.buscarLivros();

      res.status(200).json(livros);
    } catch (error: any) {
      res.status(500).json({
        erro: "Erro ao buscar os livros cadastrados. " + error.message,
      });
    }
  };

  buscarLivro = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const livro = await this.livroService.buscarLivroPeloId(id);

      if (!livro) {
        return res
          .status(404)
          .json({ erro: "Não existe um livro com esse ID." });
      }
      return res.status(200).json(livro);
    } catch (error: any) {
      res.status(500).json({
        erro: "Erro ao buscar livro. " + error.message,
      });
    }
  };

  finalizarLivro = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const livro = await this.livroService.editarLivro(req.body, id);

      if (!livro) {
        return res
          .status(404)
          .json({ erro: "Não existe um livro com esse ID." });
      }

      return res.status(200).json(livro);
    } catch (error: any) {
      res.status(400).json({
        erro: "Erro ao editar livro. " + error.message,
      });
    }
  };

  deletarLivro = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const existe = await this.livroService.deletarLivro(id);

      if (!existe) {
        return res
          .status(404)
          .json({ erro: "Não existe um livro com esse ID." });
      }
      return res.status(204).send();
    } catch (error: any) {
      res.status(500).json({
        erro: "Erro ao excluir livro. " + error.message,
      });
    }
  };
}
