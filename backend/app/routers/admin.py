from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db
from ..auth import get_admin_atual

router = APIRouter()


@router.get("/painel")
def painel_admin(
    db: Session = Depends(get_db),
    usuario=Depends(get_admin_atual)
):
    total_chapas = db.query(models.Chapa).count()
    total_eleitores = db.query(models.Usuario).filter(
        models.Usuario.tipo == "eleitor"
    ).count()
    eleicoes_ativas = db.query(models.Eleicao).filter(
        models.Eleicao.status == "ativa"
    ).count()
    eleicoes_encerradas = db.query(models.Eleicao).filter(
        models.Eleicao.status == "encerrada"
    ).count()

    return {
        "total_chapas": total_chapas,
        "total_eleitores": total_eleitores,
        "eleicoes_ativas": eleicoes_ativas,
        "eleicoes_encerradas": eleicoes_encerradas
    }


@router.get("/eleitores", response_model=List[schemas.Usuario])
def listar_eleitores(
    db: Session = Depends(get_db),
    usuario=Depends(get_admin_atual)
):
    return db.query(models.Usuario).filter(
        models.Usuario.tipo == "eleitor"
    ).all()


@router.put("/eleitores/{usuario_id}/ativar")
def ativar_eleitor(
    usuario_id: int,
    db: Session = Depends(get_db),
    usuario=Depends(get_admin_atual)
):
    eleitor = db.query(models.Usuario).filter(
        models.Usuario.id == usuario_id
    ).first()

    if not eleitor:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    eleitor.ativo = True
    db.commit()
    return {"mensagem": "Usuário ativado com sucesso"}


@router.put("/eleitores/{usuario_id}/desativar")
def desativar_eleitor(
    usuario_id: int,
    db: Session = Depends(get_db),
    usuario=Depends(get_admin_atual)
):
    eleitor = db.query(models.Usuario).filter(
        models.Usuario.id == usuario_id
    ).first()

    if not eleitor:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    eleitor.ativo = False
    db.commit()
    return {"mensagem": "Usuário desativado com sucesso"}


@router.get("/resultados")
def resultados_parciais(
    db: Session = Depends(get_db),
    usuario=Depends(get_admin_atual)
):
    eleicoes = db.query(models.Eleicao).all()
    resultado = []

    for eleicao in eleicoes:
        total_votos = db.query(models.Voto).filter(
            models.Voto.eleicao_id == eleicao.id
        ).count()

        chapas = db.query(models.Chapa).filter(
            models.Chapa.eleicao_id == eleicao.id
        ).all()

        chapas_resultado = []
        for chapa in chapas:
            votos_chapa = db.query(models.Voto).filter(
                models.Voto.chapa_id == chapa.id
            ).count()

            percentual = (votos_chapa / total_votos * 100) if total_votos > 0 else 0

            chapas_resultado.append({
                "chapa_id": chapa.id,
                "nome": chapa.nome,
                "numero": chapa.numero,
                "total_votos": votos_chapa,
                "percentual": round(percentual, 2)
            })

        resultado.append({
            "eleicao_id": eleicao.id,
            "titulo": eleicao.titulo,
            "status": eleicao.status,
            "total_votos": total_votos,
            "chapas": sorted(chapas_resultado, key=lambda x: x["total_votos"], reverse=True)
        })

    return resultado