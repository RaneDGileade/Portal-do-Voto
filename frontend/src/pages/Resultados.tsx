import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { eleicaoService } from '../services/api'
import type { ResultadoChapa, Eleicao } from '../types'

export default function Resultados() {
  const navigate = useNavigate()
  const { eleicaoId } = useParams()
  const [resultados, setResultados] = useState<ResultadoChapa[]>([])
  const [eleicao, setEleicao] = useState<Eleicao | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let interval: number | undefined

    const carregar = async () => {
      try {
        const [r, e] = await Promise.all([
          eleicaoService.resultado(Number(eleicaoId)),
          eleicaoService.buscar(Number(eleicaoId))
        ])
        setResultados(r)
        setEleicao(e)
      } catch (err) {
        console.error(err)
      } finally {
        setCarregando(false)
      }
    }

    carregar()
    interval = window.setInterval(carregar, 15000)

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [eleicaoId])

  const totalVotos = resultados.reduce((acc, r) => acc + r.total_votos, 0)
  const encerrada = eleicao?.status === 'encerrada'
  const vencedor = encerrada && resultados.length > 0 ? resultados[0] : null

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D1B6E', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '16px 24px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '22px', fontWeight: '700' }}>
          Portal do <span style={{ color: '#FF3D00' }}>Voto</span>
        </h1>
      </div>

      {/* Card */}
      <div style={{
        flex: 1,
        backgroundColor: '#F0F2F5',
        borderRadius: '20px 20px 0 0',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h2 style={{ color: '#000', fontSize: '22px', fontWeight: '700', textAlign: 'center', marginBottom: '24px' }}>
          {encerrada ? 'Resultados' : 'Resultados parciais'}
        </h2>

        {carregando ? (
          <p style={{ color: '#888', textAlign: 'center' }}>Carregando...</p>
        ) : resultados.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#888', fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
              Nenhum voto registrado ainda
            </p>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {resultados.map((resultado, index) => (
              <div key={resultado.chapa_id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ color: '#000', fontSize: '16px', fontWeight: '700' }}>
                    {resultado.nome}
                  </h3>
                  {encerrada && index === 0 && (
                    <span style={{
                      backgroundColor: '#F6AD55',
                      color: '#000',
                      padding: '4px 16px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '700'
                    }}>
                      VENCEDOR
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  {/* Foto */}
                  <div style={{
                    width: '100px', height: '120px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    {resultado.foto_url ? (
                      <img src={resultado.foto_url} alt={resultado.nome}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>
                        👤
                      </div>
                    )}
                    <p style={{ color: '#000', fontSize: '12px', fontWeight: '700', textAlign: 'center', padding: '4px' }}>
                      {resultado.nome}
                    </p>
                  </div>

                  {/* Barra e stats */}
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#000', fontSize: '16px', textAlign: 'right', marginBottom: '6px' }}>
                      {resultado.percentual}% dos votos
                    </p>
                    <div style={{ backgroundColor: '#ddd', borderRadius: '20px', height: '12px', marginBottom: '6px' }}>
                      <div style={{
                        backgroundColor: '#6B9FE8',
                        height: '100%',
                        borderRadius: '20px',
                        width: `${resultado.percentual}%`,
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                    <p style={{ color: '#999', fontSize: '14px', textAlign: 'right' }}>
                      {resultado.total_votos} votos
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {eleicao && (
              <p style={{ color: '#000', fontSize: '14px', fontWeight: '700', textAlign: 'center', marginTop: '8px' }}>
                Votação encerra em {new Date(eleicao.fim).toLocaleDateString('pt-BR')} às {new Date(eleicao.fim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => navigate('/home')}
          style={{
            width: '100%',
            padding: '18px',
            backgroundColor: '#2B6CB0',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif',
            marginTop: '20px'
          }}
        >
          Voltar
        </button>
      </div>
    </div>
  )
}