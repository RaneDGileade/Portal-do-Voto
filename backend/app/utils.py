from datetime import datetime, timezone
from sqlalchemy.orm import Session
from . import models


def sincronizar_status_todos(db: Session):
    agora = datetime.now(timezone.utc)
    eleicoes = db.query(models.Eleicao).all()
    atualizou = False

    for eleicao in eleicoes:
        inicio = eleicao.inicio
        fim = eleicao.fim
        if inicio.tzinfo is None:
            inicio = inicio.replace(tzinfo=timezone.utc)
        if fim.tzinfo is None:
            fim = fim.replace(tzinfo=timezone.utc)

        if agora >= fim and eleicao.status != "encerrada":
            eleicao.status = "encerrada"
            atualizou = True
        elif inicio <= agora < fim and eleicao.status != "ativa":
            eleicao.status = "ativa"
            atualizou = True

    if atualizou:
        db.commit()
    return eleicoes


def sincronizar_status_eleicao(eleicao: models.Eleicao, db: Session):
    agora = datetime.now(timezone.utc)
    atualizado = False

    inicio = eleicao.inicio
    fim = eleicao.fim
    if inicio.tzinfo is None:
        inicio = inicio.replace(tzinfo=timezone.utc)
    if fim.tzinfo is None:
        fim = fim.replace(tzinfo=timezone.utc)

    if agora >= fim and eleicao.status != "encerrada":
        eleicao.status = "encerrada"
        atualizado = True
    elif inicio <= agora < fim and eleicao.status != "ativa":
        eleicao.status = "ativa"
        atualizado = True

    if atualizado:
        db.add(eleicao)
        db.commit()
        db.refresh(eleicao)

    return eleicao
