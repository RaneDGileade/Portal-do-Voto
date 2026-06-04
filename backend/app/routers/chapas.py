from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db
from ..auth import get_usuario_atual, get_admin_atual

router = APIRouter()


@router.get("/", response_model=List[schemas.Chapa])
def listar_chapas(db: Session = Depends(get_db)):
    return db.query(models.Chapa).all()


@router.get("/eleicao/{eleicao_id}", response_model=List[schemas.Chapa])
def listar_chapas_por_eleicao(eleicao_id: int, db: Session = Depends(get_db)):
    return db.query(models.Chapa).filter(
        models.Chapa.eleicao_id == eleicao_id
    ).all()


@router.get("/{chapa_id}", response_model=schemas.Chapa)
def buscar_chapa(chapa_id: int, db: Session = Depends(get_db)):
    chapa = db.query(models.Chapa).filter(
        models.Chapa.id == chapa_id
    ).first()

    if not chapa:
        raise HTTPException(status_code=404, detail="Chapa não encontrada")
    return chapa


@router.post("/", response_model=schemas.Chapa)
def criar_chapa(
    dados: schemas.ChapaCreate,
    db: Session = Depends(get_db),
    usuario=Depends(get_admin_atual)
):
    # Verifica se número já existe na eleição
    existente = db.query(models.Chapa).filter(
        models.Chapa.eleicao_id == dados.eleicao_id,
        models.Chapa.numero == dados.numero
    ).first()

    if existente:
        raise HTTPException(
            status_code=400,
            detail="Já existe uma chapa com esse número nesta eleição"
        )

    chapa = models.Chapa(**dados.model_dump())
    db.add(chapa)
    db.commit()
    db.refresh(chapa)
    return chapa


@router.put("/{chapa_id}", response_model=schemas.Chapa)
def atualizar_chapa(
    chapa_id: int,
    dados: schemas.ChapaUpdate,
    db: Session = Depends(get_db),
    usuario=Depends(get_admin_atual)
):
    chapa = db.query(models.Chapa).filter(
        models.Chapa.id == chapa_id
    ).first()

    if not chapa:
        raise HTTPException(status_code=404, detail="Chapa não encontrada")

    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(chapa, campo, valor)

    db.commit()
    db.refresh(chapa)
    return chapa


@router.delete("/{chapa_id}")
def deletar_chapa(
    chapa_id: int,
    db: Session = Depends(get_db),
    usuario=Depends(get_admin_atual)
):
    chapa = db.query(models.Chapa).filter(
        models.Chapa.id == chapa_id
    ).first()

    if not chapa:
        raise HTTPException(status_code=404, detail="Chapa não encontrada")

    db.delete(chapa)
    db.commit()
    return {"mensagem": "Chapa deletada com sucesso"}