<img width="300" height="350" alt="Slogan (1)" src="https://github.com/user-attachments/assets/fb2c84fb-b50d-4e65-ba22-adb250b168f2" />

<img width="300" height="350" alt="Home aluno" src="https://github.com/user-attachments/assets/839caa44-7569-4728-90a1-506d90c7ae13" />

<img width="300" height="350" alt="tela votação" src="https://github.com/user-attachments/assets/6fb023d5-ebd4-476a-a89c-ce2d24a5a203" />


# Portal do Voto

## Sobre
Portal do Voto é uma plataforma de votação eletrônica pensada para simulações de eleições, projetos escolares, grêmios estudantis e pequenas organizações. O sistema combina um backend em Python com FastAPI e um frontend em React + TypeScript para oferecer cadastro, autenticação, gestão de eleições e apuração de votos.

## Principais funcionalidades
- Cadastro e login de usuários com autenticação JWT.
- Painel administrativo para criar e gerenciar eleições e chapas.
- Interface de votação com experiência semelhante a uma urna eletrônica.
- Visualização de resultados e apuração em tempo real.
- Rotas dedicadas para autenticação, eleições, chapas, votos e administração.

## Tecnologias
- Backend: Python, FastAPI, SQLAlchemy, Pydantic, JWT, bcrypt, python-dotenv.
- Frontend: React, TypeScript, Vite, axios, react-router-dom.
- Banco de dados: configurado via `DATABASE_URL` no arquivo `backend/.env`.

## Estrutura do projeto
- `backend/`
  - `app/main.py` — aplicação FastAPI e configuração de CORS.
  - `app/auth.py` — autenticação, hashing de senha e geração de tokens JWT.
  - `app/database.py` — configuração do SQLAlchemy e conexão com o banco.
  - `app/models.py` — modelos de dados do sistema.
  - `app/schemas.py` — schemas Pydantic para validação.
  - `app/routers/` — endpoints para autenticação, eleições, chapas, votos e admin.
- `frontend/`
  - `src/` — páginas, componentes, serviços e rotas do cliente.
  - `src/pages/` — telas como Login, Cadastro, Votação, Resultados e Admin.
  - `src/services/api.ts` — cliente axios para comunicação com a API.

## Instalação

Os links de instalação e os detalhes completos de configuração do ambiente serão disponibilizados em breve pelo desenvolvedor.

## Uso
- Use o painel administrativo para criar eleições e chapas.
- Permita que eleitores façam seus votos e acompanhe os resultados.

## Observações
- A aplicação foi pensada para ambientes educativos e pequenos grupos.
- É possível melhorar o projeto com testes automatizados, validações de frontend e suporte a mais tipos de banco de dados.


