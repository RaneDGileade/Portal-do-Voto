from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, eleicoes, chapas, votos, admin

# Cria as tabelas no banco
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Portal do Voto API",
    description="API para sistema de votação",
    version="1.0.0"
)

# CORS — permite o frontend acessar a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/auth", tags=["Autenticação"])
app.include_router(eleicoes.router, prefix="/eleicoes", tags=["Eleições"])
app.include_router(chapas.router, prefix="/chapas", tags=["Chapas"])
app.include_router(votos.router, prefix="/votos", tags=["Votos"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])

@app.get("/")
def root():
    return {"message": "Portal do Voto API funcionando!"}