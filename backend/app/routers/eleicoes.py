from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db
from ..auth import get_usuario_atual, get_admin_atual

router = APIRouter()


@router.get("/", response_model=List[schemas.Eleicao])
def listar_eleicoes(db: Session = Depends(get_db)):
    return db.query(models.Eleicao).all()


@router.get("/ativas", response_model=List[schemas.Eleicao])
def listar_eleicoes_ativas(db: Session = Depends(get_db)):
    return db.query(models.Eleicao).filter(
        models.Eleicao.status == "ativa"
    ).all()


@router.get("/{eleicao_id}", response_model=schemas.Eleicao)
def buscar_eleicao(eleicao_id: int, db: Session = Depends(get_db)):
    eleicao = db.query(models.Eleicao).filter(
        models.Eleicao.id == eleicao_id
    ).first()

    if not eleicao:
        raise HTTPException(status_code=404, detail="Eleição não encontrada")
    return eleicao


@router.post("/", response_model=schemas.Eleicao)
def criar_eleicao(
    dados: schemas.EleicaoCreate,
    db: Session = Depends(get_db),
    usuario=Depends(get_admin_atual)
):
    eleicao = models.Eleicao(
        **dados.model_dump(),
        criado_por=usuario.id
    )
    db.add(eleicao)
    db.commit()
    db.refresh(eleicao)
    return eleicao


@router.put("/{eleicao_id}", response_model=schemas.Eleicao)
def atualizar_eleicao(
    eleicao_id: int,
    dados: schemas.EleicaoUpdate,
    db: Session = Depends(get_db),
    usuario=Depends(get_admin_atual)
):
    eleicao = db.query(models.Eleicao).filter(
        models.Eleicao.id == eleicao_id
    ).first()

    if not eleicao:
        raise HTTPException(status_code=404, detail="Eleição não encontrada")

    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(eleicao, campo, valor)

    db.commit()
    db.refresh(eleicao)
    return eleicao


@router.delete("/{eleicao_id}")
def deletar_eleicao(
    eleicao_id: int,
    db: Session = Depends(get_db),
    usuario=Depends(get_admin_atual)
):
    eleicao = db.query(models.Eleicao).filter(
        models.Eleicao.id == eleicao_id
    ).first()

    if not eleicao:
        raise HTTPException(status_code=404, detail="Eleição não encontrada")

    db.delete(eleicao)
    db.commit()
    return {"mensagem": "Eleição deletada com sucesso"}


@router.get("/{eleicao_id}/resultado", response_model=List[schemas.ResultadoChapa])
def resultado_eleicao(eleicao_id: int, db: Session = Depends(get_db)):
    chapas = db.query(models.Chapa).filter(
        models.Chapa.eleicao_id == eleicao_id
    ).all()

    if not chapas:
        raise HTTPException(status_code=404, detail="Nenhuma chapa encontrada")

    total_votos = db.query(models.Voto).filter(
        models.Voto.eleicao_id == eleicao_id
    ).count()

    resultado = []
    for chapa in chapas:
        votos_chapa = db.query(models.Voto).filter(
            models.Voto.chapa_id == chapa.id
        ).count()

        percentual = (votos_chapa / total_votos * 100) if total_votos > 0 else 0

        resultado.append(schemas.ResultadoChapa(
            chapa_id=chapa.id,
            nome=chapa.nome,
            numero=chapa.numero,
            foto_url=chapa.foto_url,
            total_votos=votos_chapa,
            percentual=round(percentual, 2)
        ))

    return sorted(resultado, key=lambda x: x.total_votos, reverse=True)