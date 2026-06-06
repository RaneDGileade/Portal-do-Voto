import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService } from '../../services/api'

interface ChapaResultado {
  chapa_id: number
  nome: string
  numero: string
  total_votos: number
  percentual: number
}

interface EleicaoResultado {
  eleicao_id: number
  titulo: string
  status: string
  total_votos: number
  chapas: ChapaResultado[]
}

export default function ResultadosAdmin() {
  const navigate = useNavigate()
  const [resultados, setResultados] = useState<EleicaoResultado[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregarResultados()
  }, [])

  const carregarResultados = async () => {
    try {
      const data = await adminService.resultadosParciais()
      setResultados(data)
    } catch (err) {
      console.error(err)
    } finally {
      setCarregando(false)
    }
  }

  const corStatus = (status: string) => {
    if (status === 'ativa') return '#1a7a1a'
    if (status === 'encerrada') return '#8a1a1a'
    return '#8a6a1a'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D1B6E', padding: '0' }}>
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
          Resultados parciais
        </h2>

        {carregando ? (
          <p style={{ color: '#ccc' }}>Carregando...</p>
        ) : resultados.length === 0 ? (
          <div style={{
            backgroundColor: '#1a2a8a',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#ccc' }}>Nenhuma eleição criada ainda.</p>
          </div>
        ) : (
          resultados.map(eleicao => (
            <div
              key={eleicao.eleicao_id}
              style={{
                backgroundColor: '#1a2a8a',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px'
              }}
            >
              {/* Cabeçalho eleição */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h3 style={{ color: 'white', margin: 0, fontSize: '16px' }}>
                  {eleicao.titulo}
                </h3>
                <span style={{
                  backgroundColor: corStatus(eleicao.status),
                  color: 'white',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
                  {eleicao.status}
                </span>
              </div>

              <p style={{ color: '#ccc', fontSize: '13px', marginBottom: '15px' }}>
                Total de votos: <strong style={{ color: 'white' }}>{eleicao.total_votos}</strong>
              </p>

              {/* Chapas */}
              {eleicao.chapas.length === 0 ? (
                <p style={{ color: '#ccc', fontSize: '13px' }}>
                  Nenhuma chapa cadastrada.
                </p>
              ) : (
                eleicao.chapas.map((chapa, index) => (
                  <div key={chapa.chapa_id} style={{ marginBottom: '12px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '5px'
                    }}>
                      <span style={{ color: 'white', fontSize: '14px' }}>
                        {index === 0 && '🏆 '}{chapa.nome} ({chapa.numero})
                      </span>
                      <span style={{ color: '#ccc', fontSize: '13px' }}>
                        {chapa.total_votos} votos — {chapa.percentual}%
                      </span>
                    </div>

                    {/* Barra progresso */}
                    <div style={{
                      backgroundColor: '#0D1B6E',
                      borderRadius: '4px',
                      height: '8px'
                    }}>
                      <div style={{
                        backgroundColor: index === 0 ? '#FFD700' : '#1a5a8a',
                        height: '100%',
                        borderRadius: '4px',
                        width: `${chapa.percentual}%`,
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          ))
        )}

        <button
          onClick={() => navigate('/admin')}
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