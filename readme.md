<<<<<<< HEAD
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

## Requisitos
- Python 3.10+ para o backend.
- Node.js 18+ e npm para o frontend.

## Instalação

Os links de instalação e os detalhes completos de configuração do ambiente serão disponibilizados em breve pelo desenvolvedor. Enquanto isso, as instruções de setup local estão descritas abaixo para referência.

### Backend
1. Acesse o diretório do backend:
```bash
cd backend
```
2. Instale as dependências:
```bash
python -m pip install -r requirements.txt
```
3. Ajuste as variáveis de ambiente em `backend/.env` se necessário.
4. Execute o servidor:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
1. Acesse o diretório do frontend:
```bash
cd frontend
```
2. Instale as dependências:
```bash
npm install
```
3. Inicie a aplicação:
```bash
npm run dev
```

> Se não houver scripts definidos em `package.json`, use `npx vite` ou adicione os scripts `dev`, `build` e `preview` conforme sua configuração.

## Variáveis de ambiente do backend
O arquivo `backend/.env` deve conter:
```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/portalvoto
SECRET_KEY=sua_chave_secreta
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Endpoints importantes
- `GET /` — verifica se a API está funcionando.
- `POST /auth/login` — login e geração de token.
- `POST /auth/signup` — cadastro de novos usuários.
- `GET /eleicoes` — lista eleições.
- `POST /chapas` — cadastro de chapas.
- `POST /votos` — registro de votos.
- `GET /admin` — rotas administrativas protegidas.

## Uso
- Use o painel administrativo para criar eleições e chapas.
- Permita que eleitores façam seus votos e acompanhe os resultados.

## Contribuição
1. Faça um fork deste repositório.
2. Crie uma branch com a nova funcionalidade.
3. Abra um pull request descrevendo a mudança.

## Observações
- A aplicação foi pensada para ambientes educativos e pequenos grupos.
- É possível melhorar o projeto com testes automatizados, validações de frontend e suporte a mais tipos de banco de dados.
=======
<img width="300" height="350" alt="Slogan (1)" src="https://github.com/user-attachments/assets/fb2c84fb-b50d-4e65-ba22-adb250b168f2" />

<img width="300" height="350" alt="Home aluno" src="https://github.com/user-attachments/assets/839caa44-7569-4728-90a1-506d90c7ae13" />

<img width="300" height="350" alt="tela votação" src="https://github.com/user-attachments/assets/6fb023d5-ebd4-476a-a89c-ce2d24a5a203" />
<br>
<br>
🗳️ O Portal do Voto é uma plataforma digital desenvolvida para criar, gerenciar e simular eleições de forma simples e segura. O aplicativo é ideal para ambientes escolares (grêmios, líderes de sala), acadêmicos, condomínios e simulações pedagógicas de eleições oficiais.
<br>
<br>
 Funcionalidades Principais:
 
 Criação de Eleições: Painel simples para configurar cargos, candidatos e fotos.
 
 Simulação Escolar e Geral: Interface intuitiva adaptada para estudantes e organizações.
 
 Cabine de Voto Digital: Simulador que replica a experiência de uma urna eletrônica.

 Gráficos de Resultados: Apuração instantânea com visualização em tempo real.
 
 Segurança e Auditoria: Votação criptografada que garante a unicidade do voto sem expor o eleitor.
>>>>>>> 84964bb0495532c5495f956cfec9684dced87ae6
