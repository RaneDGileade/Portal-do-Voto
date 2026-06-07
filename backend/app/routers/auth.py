from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..auth import verificar_senha, hash_senha, criar_token
from datetime import datetime, timedelta
import random
import string

router = APIRouter()


@router.post("/login", response_model=schemas.Token)
def login(dados: schemas.Login, db: Session = Depends(get_db)):
    # Busca usuário por nome e tipo
    usuario = db.query(models.Usuario).filter(
        models.Usuario.nome == dados.nome,
        models.Usuario.tipo == dados.tipo
    ).first()

    if not usuario or not verificar_senha(dados.senha, usuario.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nome ou senha inválidos"
        )

    if not usuario.ativo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuário inativo"
        )

    # Validação adicional para usuários comuns (verificar eleição)
    if dados.tipo == "usuario" and dados.nomeEleicao:
        from ..routers import eleicoes as eleicoes_router
        eleicoes = db.query(models.Eleicao).filter(
            models.Eleicao.titulo.ilike(f"%{dados.nomeEleicao}%")
        ).all()
        if not eleicoes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Eleição não encontrada"
            )

    # Validação adicional para admins (verificar instituição)
    if dados.tipo == "admin" and dados.nomeInstituicao:
        from .. import models as models_module
        instituicao = db.query(models_module.Instituicao).filter(
            models_module.Instituicao.nome.ilike(f"%{dados.nomeInstituicao}%")
        ).first()
        if not instituicao or instituicao.id != usuario.instituicao_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Instituição não corresponde ao usuário"
            )

    token = criar_token({"sub": usuario.matricula})
    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": usuario
    }


@router.post("/cadastro", response_model=schemas.Usuario)
def cadastro(dados: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    # Verifica se matrícula já existe
    if db.query(models.Usuario).filter(
        models.Usuario.matricula == dados.matricula
    ).first():
        raise HTTPException(
            status_code=400,
            detail="Matrícula já cadastrada"
        )

    # Verifica se email já existe
    if db.query(models.Usuario).filter(
        models.Usuario.email == dados.email
    ).first():
        raise HTTPException(
            status_code=400,
            detail="Email já cadastrado"
        )

    usuario = models.Usuario(
        matricula=dados.matricula,
        nome=dados.nome,
        email=dados.email,
        senha_hash=hash_senha(dados.senha),
        tipo=dados.tipo,
        instituicao_id=dados.instituicao_id
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario


@router.post("/redefinir-senha")
def redefinir_senha(dados: schemas.RedefinirSenha, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(
        models.Usuario.email == dados.email
    ).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Email não encontrado")

    # Gera código de 5 dígitos
    codigo = ''.join(random.choices(string.digits, k=5))
    expira = datetime.utcnow() + timedelta(minutes=15)

    # Salva o código
    cod = models.CodigoRedefinicao(
        usuario_id=usuario.id,
        codigo=codigo,
        expira_em=expira
    )
    db.add(cod)
    db.commit()

    # Em produção enviar por email — por ora retorna no response
    return {"mensagem": "Código enviado", "codigo": codigo}


@router.post("/verificar-codigo")
def verificar_codigo(dados: schemas.VerificarCodigo, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(
        models.Usuario.email == dados.email
    ).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Email não encontrado")

    codigo = db.query(models.CodigoRedefinicao).filter(
        models.CodigoRedefinicao.usuario_id == usuario.id,
        models.CodigoRedefinicao.codigo == dados.codigo,
        models.CodigoRedefinicao.usado == False,
        models.CodigoRedefinicao.expira_em > datetime.utcnow()
    ).first()

    if not codigo:
        raise HTTPException(status_code=400, detail="Código inválido ou expirado")

    # Atualiza senha
    from ..auth import hash_senha
    usuario.senha_hash = hash_senha(dados.nova_senha)
    codigo.usado = True
    db.commit()

    return {"mensagem": "Senha redefinida com sucesso"}