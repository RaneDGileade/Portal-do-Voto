import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { chapaService, eleicaoService } from '../services/api'
import type { Chapa, Eleicao } from '../types'

export default function Candidatos() {
  const navigate = useNavigate()
  const { eleicaoId } = useParams()
  const [chapas, setChapas] = useState<Chapa[]>([])
  const [eleicao, setEleicao] = useState<Eleicao | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    Promise.all([
      chapaService.listarPorEleicao(Number(eleicaoId)),
      eleicaoService.buscar(Number(eleicaoId))
    ]).then(([c, e]) => {
      setChapas(c)
      setEleicao(e)
    }).catch(console.error)
    .finally(() => setCarregando(false))
  }, [])

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
          Candidatos
        </h2>

        {carregando ? (
          <p style={{ color: '#888', textAlign: 'center' }}>Carregando...</p>
        ) : chapas.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#888', fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
              Ainda não existe chapas criadas para esta eleição
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            {chapas.map(chapa => (
              <div key={chapa.id} style={{
                backgroundColor: '#8B9FE8',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ color: '#000', fontSize: '14px', marginBottom: '4px' }}>
                    <strong>Chapa:</strong><br />{chapa.nome}
                  </p>
                  <p style={{ color: '#000', fontSize: '14px', marginBottom: '4px' }}>
                    <strong>Candidato:</strong><br />{chapa.nome}
                  </p>
                  <p style={{ color: '#000', fontSize: '14px' }}>
                    <strong>Número de voto:</strong> {chapa.numero}
                  </p>
                </div>
                {chapa.foto_url ? (
                  <img src={chapa.foto_url} alt={chapa.nome} style={{
                    width: '90px', height: '110px',
                    objectFit: 'cover', borderRadius: '8px'
                  }} />
                ) : (
                  <div style={{
                    width: '90px', height: '110px',
                    backgroundColor: '#c0c8f0',
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '30px'
                  }}>
                    👤
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate('/home')}
          style={{
            width: '100%',
            padding: '18px',
            backgroundColor: '#2F855A',
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
          voltar
        </button>
      </div>
    </div>
  )
}