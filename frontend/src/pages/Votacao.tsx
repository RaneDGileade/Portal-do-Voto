import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { chapaService, votoService } from '../services/api'
import { Chapa } from '../types'

export default function Votacao() {
  const navigate = useNavigate()
  const { eleicaoId } = useParams()
  const [numero, setNumero] = useState('')
  const [chapa, setChapa] = useState<Chapa | null>(null)
  const [erro, setErro] = useState('')
  const [votado, setVotado] = useState(false)
  const [modal, setModal] = useState(false)
  const [carregando, setCarregando] = useState(false)

  const handleNumero = (n: string) => {
    if (numero.length < 2) {
      const novoNumero = numero + n
      setNumero(novoNumero)
      setErro('')
      if (novoNumero.length === 2) buscarChapa(novoNumero)
    }
  }

  const buscarChapa = async (num: string) => {
    try {
      const chapas = await chapaService.listarPorEleicao(Number(eleicaoId))
      const encontrada = chapas.find((c: Chapa) => c.numero === num)
      if (encontrada) {
        setChapa(encontrada)
      } else {
        setChapa(null)
        setErro('Número não encontrado')
      }
    } catch (err) {
      setErro('Erro ao buscar chapa')
    }
  }

  const handleApagar = () => {
    setNumero('')
    setChapa(null)
    setErro('')
  }

  const handleConfirmar = async () => {
    if (!chapa) return
    setCarregando(true)
    try {
      await votoService.votar(chapa.id, Number(eleicaoId))
      setVotado(true)
      setModal(false)
    } catch (err: any) {
      setErro(err.response?.data?.detail || 'Erro ao votar')
      setModal(false)
    } finally {
      setCarregando(false)
    }
  }

  if (votado) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0D1B6E',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#1a7a1a',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          fontSize: '40px'
        }}>
          ✓
        </div>
        <h2 style={{ color: 'white', fontSize: '24px', marginBottom: '30px' }}>
          Voto Confirmado!
        </h2>
        <button
          onClick={() => navigate('/home')}
          style={{
            padding: '14px 40px',
            backgroundColor: '#1a7a1a',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Voltar
        </button>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0D1B6E',
      padding: '0'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#0a1560',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ color: 'white', fontSize: '20px', margin: 0 }}>
          Portal Do <span style={{ color: '#FF4500' }}>Voto</span>
        </h1>
      </div>

      <div style={{ padding: '20px' }}>
        <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '20px' }}>
          Digite o número da chapa
        </h2>

        {/* Display número */}
        <div style={{
          backgroundColor: '#1a2a8a',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '15px'
          }}>
            {[0, 1].map(i => (
              <div key={i} style={{
                width: '60px',
                height: '70px',
                backgroundColor: '#0D1B6E',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {numero[i] || ''}
              </div>
            ))}
          </div>

          {/* Info chapa */}
          {chapa && (
            <div style={{ color: 'white', marginBottom: '10px' }}>
              {chapa.foto_url && (
                <img
                  src={chapa.foto_url}
                  alt={chapa.nome}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '8px'
                  }}
                />
              )}
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{chapa.nome}</p>
            </div>
          )}

          {erro && (
            <p style={{ color: '#ff4444', fontSize: '14px' }}>{erro}</p>
          )}
        </div>

        {/* Teclado numérico */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          marginBottom: '20px'
        }}>
          {['1','2','3','4','5','6','7','8','9','','0',''].map((n, i) => (
            <button
              key={i}
              onClick={() => n && handleNumero(n)}
              style={{
                padding: '18px',
                backgroundColor: n ? '#1a2a8a' : 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '24px',
                fontWeight: 'bold',
                cursor: n ? 'pointer' : 'default'
              }}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Botões ação */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/home')}
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: '#8a1a1a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Voltar
          </button>
          <button
            onClick={handleApagar}
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: '#8a6a1a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Apagar
          </button>
          <button
            onClick={() => chapa && setModal(true)}
            disabled={!chapa}
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: chapa ? '#1a7a1a' : '#555',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: chapa ? 'pointer' : 'not-allowed'
            }}
          >
            Confirmar
          </button>
        </div>
      </div>

      {/* Modal confirmação */}
      {modal && chapa && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#1a2a8a',
            borderRadius: '12px',
            padding: '30px',
            width: '100%',
            maxWidth: '320px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: 'white', marginBottom: '10px' }}>
              Confirmar seu voto?
            </h3>
            <p style={{ color: '#ccc', marginBottom: '20px' }}>
              {chapa.nome} — Número {chapa.numero}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#8a1a1a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmar}
                disabled={carregando}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#1a7a1a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {carregando ? 'Votando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}