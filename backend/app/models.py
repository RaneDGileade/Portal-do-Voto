from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Instituicao(Base):
    __tablename__ = "instituicoes"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    uf = Column(String(2), nullable=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    usuarios = relationship("Usuario", back_populates="instituicao")
    eleicoes = relationship("Eleicao", back_populates="instituicao")


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    matricula = Column(String, unique=True, nullable=False, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    senha_hash = Column(String, nullable=False)
    tipo = Column(String, default="eleitor")
    ativo = Column(Boolean, default=True)
    instituicao_id = Column(Integer, ForeignKey("instituicoes.id"), nullable=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    instituicao = relationship("Instituicao", back_populates="usuarios")
    votos = relationship("Voto", back_populates="usuario")
    codigos_redefinicao = relationship("CodigoRedefinicao", back_populates="usuario")


class Eleicao(Base):
    __tablename__ = "eleicoes"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    instituicao_id = Column(Integer, ForeignKey("instituicoes.id"), nullable=False)
    inicio = Column(DateTime(timezone=True), nullable=False)
    fim = Column(DateTime(timezone=True), nullable=False)
    status = Column(String, default="rascunho")
    criado_por = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    instituicao = relationship("Instituicao", back_populates="eleicoes")
    chapas = relationship("Chapa", back_populates="eleicao")
    votos = relationship("Voto", back_populates="eleicao")


class Chapa(Base):
    __tablename__ = "chapas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    numero = Column(String(2), nullable=False)
    foto_url = Column(String, nullable=True)
    descricao = Column(String, nullable=True)
    eleicao_id = Column(Integer, ForeignKey("eleicoes.id"), nullable=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    eleicao = relationship("Eleicao", back_populates="chapas")
    votos = relationship("Voto", back_populates="chapa")


class Voto(Base):
    __tablename__ = "votos"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    chapa_id = Column(Integer, ForeignKey("chapas.id"), nullable=False)
    eleicao_id = Column(Integer, ForeignKey("eleicoes.id"), nullable=False)
    votado_em = Column(DateTime(timezone=True), server_default=func.now())

    usuario = relationship("Usuario", back_populates="votos")
    chapa = relationship("Chapa", back_populates="votos")
    eleicao = relationship("Eleicao", back_populates="votos")

    __table_args__ = (
        UniqueConstraint("usuario_id", "eleicao_id", name="uq_voto_usuario_eleicao"),
    )


class CodigoRedefinicao(Base):
    __tablename__ = "codigos_redefinicao"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    codigo = Column(String(5), nullable=False)
    expira_em = Column(DateTime(timezone=True), nullable=False)
    usado = Column(Boolean, default=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    usuario = relationship("Usuario", back_populates="codigos_redefinicao")