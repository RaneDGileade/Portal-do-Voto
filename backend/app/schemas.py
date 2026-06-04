from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Instituição
class InstituicaoBase(BaseModel):
    nome: str
    uf: str

class InstituicaoCreate(InstituicaoBase):
    pass

class Instituicao(InstituicaoBase):
    id: int
    criado_em: datetime

    class Config:
        from_attributes = True


# Usuário
class UsuarioBase(BaseModel):
    matricula: str
    nome: str
    email: EmailStr
    tipo: str = "eleitor"
    instituicao_id: int

class UsuarioCreate(UsuarioBase):
    senha: str

class Usuario(UsuarioBase):
    id: int
    ativo: bool
    criado_em: datetime

    class Config:
        from_attributes = True


# Eleição
class EleicaoBase(BaseModel):
    titulo: str
    instituicao_id: int
    inicio: datetime
    fim: datetime
    status: str = "rascunho"

class EleicaoCreate(EleicaoBase):
    pass

class EleicaoUpdate(BaseModel):
    titulo: Optional[str] = None
    inicio: Optional[datetime] = None
    fim: Optional[datetime] = None
    status: Optional[str] = None

class Eleicao(EleicaoBase):
    id: int
    criado_por: int
    criado_em: datetime

    class Config:
        from_attributes = True


# Chapa
class ChapaBase(BaseModel):
    nome: str
    numero: str
    foto_url: Optional[str] = None
    descricao: Optional[str] = None
    eleicao_id: int

class ChapaCreate(ChapaBase):
    pass

class ChapaUpdate(BaseModel):
    nome: Optional[str] = None
    numero: Optional[str] = None
    foto_url: Optional[str] = None
    descricao: Optional[str] = None

class Chapa(ChapaBase):
    id: int
    criado_em: datetime

    class Config:
        from_attributes = True


# Voto
class VotoCreate(BaseModel):
    chapa_id: int
    eleicao_id: int

class Voto(BaseModel):
    id: int
    usuario_id: int
    chapa_id: int
    eleicao_id: int
    votado_em: datetime

    class Config:
        from_attributes = True


# Auth
class Login(BaseModel):
    matricula: str
    senha: str

class Token(BaseModel):
    access_token: str
    token_type: str
    usuario: Usuario

class RedefinirSenha(BaseModel):
    email: EmailStr

class VerificarCodigo(BaseModel):
    email: EmailStr
    codigo: str
    nova_senha: str


# Resultado
class ResultadoChapa(BaseModel):
    chapa_id: int
    nome: str
    numero: str
    foto_url: Optional[str] = None
    total_votos: int
    percentual: float