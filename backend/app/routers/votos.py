from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..auth import get_usuario_atual
from ..utils import sincronizar_status_eleicao

router = APIRouter()


@router.post("/", response_model=schemas.Voto)
def registrar_voto(
    dados: schemas.VotoCreate,
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_atual)
):
    # Verifica se eleição existe e está ativa
    eleicao = db.query(models.Eleicao).filter(
        models.Eleicao.id == dados.eleicao_id
    ).first()

    if not eleicao:
        raise HTTPException(status_code=404, detail="Eleição não encontrada")

    sincronizar_status_eleicao(eleicao, db)

    if eleicao.status != "ativa":
        raise HTTPException(
            status_code=400,
            detail="Eleição não está ativa"
        )

    # Verifica se usuário já votou nessa eleição
    voto_existente = db.query(models.Voto).filter(
        models.Voto.usuario_id == usuario.id,
        models.Voto.eleicao_id == dados.eleicao_id
    ).first()

    if voto_existente:
        raise HTTPException(
            status_code=400,
            detail="Você já votou nesta eleição"
        )

    # Verifica se chapa existe e pertence à eleição
    chapa = db.query(models.Chapa).filter(
        models.Chapa.id == dados.chapa_id,
        models.Chapa.eleicao_id == dados.eleicao_id
    ).first()

    if not chapa:
        raise HTTPException(
            status_code=404,
            detail="Chapa não encontrada nesta eleição"
        )

    voto = models.Voto(
        usuario_id=usuario.id,
        chapa_id=dados.chapa_id,
        eleicao_id=dados.eleicao_id
    )
    db.add(voto)
    db.commit()
    db.refresh(voto)
    return voto


@router.get("/participadas", response_model=list[schemas.Eleicao])
def listar_participadas(
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_atual)
):
    eleicoes = (
        db.query(models.Eleicao)
        .join(models.Voto, models.Voto.eleicao_id == models.Eleicao.id)
        .filter(
            models.Voto.usuario_id == usuario.id,
            models.Eleicao.status == "encerrada"
        )
        .all()
    )
    return eleicoes


@router.get("/meu-voto/{eleicao_id}")
def verificar_meu_voto(
    eleicao_id: int,
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_atual)
):
    voto = db.query(models.Voto).filter(
        models.Voto.usuario_id == usuario.id,
        models.Voto.eleicao_id == eleicao_id
    ).first()

    return {"ja_votou": voto is not None}