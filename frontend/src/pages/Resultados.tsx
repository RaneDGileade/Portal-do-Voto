import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { eleicaoService } from '../services/api'
import { ResultadoChapa, Eleicao } from '../types'

export default function Resultados() {
  const navigate = useNavigate()
  const { eleicaoId } = useParams()
  const [resultados, setResultados] = useState<ResultadoChapa[]>([])
  const [eleicao, setEleicao] = useState<Eleicao | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const [resultadosData, eleicaoData] = await Promise.all([
        eleicaoService.resultado(Number(eleicaoId)),
        eleicaoService.buscar(Number(eleicaoId))
      ])
      setResultados(resultadosData)
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
          Resultados
        </h2>
        {eleicao && (
          <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '20px' }}>
            {eleicao.titulo}
          </p>
        )}

        {carregando ? (
          <p style={{ color: '#ccc' }}>Carregando...</p>
        ) : resultados.length === 0 ? (
          <div style={{
            backgroundColor: '#1a2a8a',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#ccc' }}>Nenhum voto registrado ainda.</p>
          </div>
        ) : (
          resultados.map((resultado, index) => (
            <div
              key={resultado.chapa_id}
              style={{
                backgroundColor: index === 0 ? '#1a4a8a' : '#1a2a8a',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '15px',
                border: index === 0 ? '2px solid #FFD700' : 'none'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '10px'
              }}>
                {/* Posição */}
                <div style={{
                  width: '35px',
                  height: '35px',
                  borderRadius: '50%',
                  backgroundColor: index === 0 ? '#FFD700' : '#0D1B6E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: index === 0 ? '#000' : 'white',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  flexShrink: 0
                }}>
                  {index + 1}
                </div>

                {/* Foto */}
                {resultado.foto_url ? (
                  <img
                    src={resultado.foto_url}
                    alt={resultado.nome}
                    style={{
                      width: '55px',
                      height: '55px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                ) : (
                  <div style={{
                    width: '55px',
                    height: '55px',
                    borderRadius: '50%',
                    backgroundColor: '#0D1B6E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ccc',
                    fontSize: '24px',
                    flexShrink: 0
                  }}>
                    👤
                  </div>
                )}

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: 'white', margin: '0 0 3px 0', fontSize: '16px' }}>
                    {resultado.nome}
                  </h3>
                  <p style={{ color: '#ccc', margin: 0, fontSize: '13px' }}>
                    Número: {resultado.numero}
                  </p>
                </div>

                {/* Vencedor */}
                {index === 0 && (
                  <span style={{
                    backgroundColor: '#FFD700',
                    color: '#000',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    VENCEDOR
                  </span>
                )}
              </div>

              {/* Barra de progresso */}
              <div style={{
                backgroundColor: '#0D1B6E',
                borderRadius: '4px',
                height: '8px',
                marginBottom: '5px'
              }}>
                <div style={{
                  backgroundColor: index === 0 ? '#FFD700' : '#1a7a1a',
                  height: '100%',
                  borderRadius: '4px',
                  width: `${resultado.percentual}%`,
                  transition: 'width 0.5s ease'
                }} />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: '#ccc',
                fontSize: '13px'
              }}>
                <span>{resultado.total_votos} votos</span>
                <span>{resultado.percentual}%</span>
              </div>
            </div>
          ))
        )}

        <button
          onClick={() => navigate('/home')}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#8a1a1a',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Voltar
        </button>
      </div>
    </div>
  )
}