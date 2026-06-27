export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  qtdPaginas: number;
  comecouEm: Date | null;
  terminouEm: Date | null;
  nota: number | null;
  opiniao: string | null;
}

export interface SessaoLeitura {
  id: number;
  idLivro: number;
  qtdPaginas: number | null;
  comentario: string | null;
  dataSessao: Date;
}
