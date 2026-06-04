import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { chapaService, eleicaoService } from '../services/api'
import { Chapa, Eleicao } from '../types'

export default function Candidatos() {
  const navigate = useNavigate()
  const { eleicaoId } = useParams()
  const [chapas, setChapas] = useState<Chapa[]>([])
  const [eleicao, setEleicao] = useState<Eleicao | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const [chapasData, eleicaoData] = await Promise.all([
        chapaService.listarPorEleicao(Number(eleicaoId)),
        eleicaoService.buscar(Number(eleicaoId))
      ])
      setChapas(chapasData)
      setEleicao(eleicaoData)
    } catch (err) {
      console.error(err)
    } finally {
      setCarregando(false)
    }
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
        <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '5px' }}>
          Candidatos
        </h2>
        {eleicao && (
          <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '20px' }}>
            {eleicao.titulo}
          </p>
        )}

        {carregando ? (
          <p style={{ color: '#ccc' }}>Carregando...</p>
        ) : chapas.length === 0 ? (
          <div style={{
            backgroundColor: '#1a2a8a',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#ccc' }}>
              Nenhum candidato cadastrado ainda para esta eleição.
            </p>
          </div>
        ) : (
          chapas.map(chapa => (
            <div
              key={chapa.id}
              style={{
                backgroundColor: '#1a2a8a',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}
            >
              {/* Foto */}
              {chapa.foto_url ? (
                <img
                  src={chapa.foto_url}
                  alt={chapa.nome}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
              ) : (
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  backgroundColor: '#0D1B6E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ccc',
                  fontSize: '28px',
                  flexShrink: 0
                }}>
                  👤
                </div>
              )}

              {/* Info */}
              <div style={{ flex: 1 }}>
                <h3 style={{ color: 'white', margin: '0 0 5px 0', fontSize: '16px' }}>
                  {chapa.nome}
                </h3>
                <p style={{ color: '#FF4500', margin: '0 0 5px 0', fontSize: '14px' }}>
                  Número: {chapa.numero}
                </p>
                {chapa.descricao && (
                  <p style={{ color: '#ccc', margin: 0, fontSize: '13px' }}>
                    {chapa.descricao}
                  </p>
                )}
              </div>
            </div>
          ))
        )}

        {/* Botões */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
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
            onClick={() => navigate(`/votacao/${eleicaoId}`)}
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: '#1a7a1a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Votar
          </button>
        </div>
      </div>
    </div>
  )
}