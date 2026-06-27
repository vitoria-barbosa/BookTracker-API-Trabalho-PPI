import { Router } from "express";
import { LivroController } from "./controllers/livroController";
import { SessaoLeituraController } from "./controllers/sessaoLeituraController";

const router = Router();
const livroController = new LivroController();
const sessaoLeituraController = new SessaoLeituraController();

router.post("/livros", livroController.adicionarLivro);
router.get("/livros", livroController.buscarLivros);
router.get("/livros/:id", livroController.buscarLivro);
router.patch("/livros/:id", livroController.finalizarLivro);
router.delete("/livros/:id", livroController.deletarLivro);

router.post(
  "/livros/:idLivro/sessoes-de-leitura",
  sessaoLeituraController.adicionarSessao,
);
router.get(
  "/livros/:idLivro/sessoes-de-leitura",
  sessaoLeituraController.buscarSessoesDeUmLivro,
);

router.get("/sessoes-de-leitura/:id", sessaoLeituraController.buscarSessao);
router.patch(
  "/sessoes-de-leitura/:id",
  sessaoLeituraController.atualizarSessao,
);
router.delete("/sessoes-de-leitura/:id", sessaoLeituraController.deletarSessao);

export default router;
