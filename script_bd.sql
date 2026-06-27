CREATE TABLE livro (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  autor VARCHAR(255) NOT NULL,
  genero VARCHAR(100) NOT NULL,
  qtd_paginas INTEGER NOT NULL,
  comecou_em DATE,
  terminou_em DATE,
  nota INTEGER,
  opiniao TEXT
);

CREATE TABLE sessao_leitura (
  id SERIAL PRIMARY KEY,
  id_livro INTEGER NOT NULL REFERENCES livro(id) ON DELETE CASCADE,
  qtd_paginas INTEGER NOT NULL,
  comentario TEXT,
  data_sessao DATE
);