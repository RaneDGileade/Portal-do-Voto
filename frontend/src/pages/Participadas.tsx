import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { eleicaoService, votoService } from '../services/api'
import Sidebar from '../components/Sidebar'
import type { Eleicao, ResultadoChapa, Usuario } from '../types'

export default function Participadas() {
  const navigate = useNavigate()
  const [eleicoes, setEleicoes] = useState<Eleicao[]>([])
  const [selecionada, setSelecionada] = useState<Eleicao | null>(null)
  const [resultados, setResultados] = useState<ResultadoChapa[]>([])
  const [carregando, setCarregando] = useState(true)
  const [carregandoResultados, setCarregandoResultados] = useState(false)
  const [sidebarAberta, setSidebarAberta] = useState(false)
  const usuario: Usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  useEffect(() => {
    votoService.listarParticipadas()
      .then(setEleicoes)
      .catch(console.error)
      .finally(() => setCarregando(false))
  }, [])

  const verDetalhes = async (e: Eleicao) => {
    setSelecionada(e)
    setCarregandoResultados(true)
    setResultados([])
    try {
      const res = await eleicaoService.resultado(e.id)
      setResultados(res)
    } catch (err) {
      console.error('Erro ao buscar resultados', err)
    } finally {
      setCarregandoResultados(false)
    }
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <h1>Portal do <span>Voto</span></h1>
        <button
          onClick={() => setSidebarAberta(true)}
          className="profile-toggle"
          style={{
            width: '38px', height: '38px', borderRadius: '50%',
            backgroundColor: '#2B6CB0', color: 'white', border: 'none',
            cursor: 'pointer', fontSize: '16px', fontWeight: '700',
            fontFamily: 'Poppins, sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          {usuario.nome?.charAt(0).toUpperCase() || '?'}
        </button>
      </div>

      <div className="page-card">
        {!selecionada ? (
          <>
            <h2 className="page-title">Eleições participadas</h2>

            {carregando ? (
              <p style={{ color: '#666' }}>Buscando seu histórico...</p>
            ) : eleicoes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗳️</div>
                <h3 style={{ color: '#0A1560', marginBottom: '10px' }}>Histórico vazio</h3>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
                  As eleições em que você votou aparecerão aqui assim que forem encerradas.
                </p>
                <button
                  onClick={() => navigate('/home')}
                  className="button-secondary button-block"
                >
                  Voltar para o Início
                </button>
              </div>
            ) : (
              <>
                {eleicoes.map(e => (
                  <div
                    key={e.id}
                    onClick={() => verDetalhes(e)}
                    className="card"
                    style={{ cursor: 'pointer' }}
                  >
                    <h3 style={{ margin: 0, color: '#0A1560', fontSize: '18px' }}>{e.titulo}</h3>
                    <p style={{ margin: '6px 0 0', color: '#9B5BA5', fontWeight: 'bold', fontSize: '14px' }}>
                      Ver resultados →
                    </p>
                  </div>
                ))}
                <button onClick={() => navigate('/home')} className="button-secondary button-block">
                  Voltar para o Início
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => setSelecionada(null)}
              className="button-tertiary"
              style={{ color: '#FF3D00', fontWeight: '800', padding: '0 0 8px', textAlign: 'left' }}
            >
              ← Voltar para a lista
            </button>

            <h2 className="page-title">Resultado: {selecionada.titulo}</h2>

            {carregandoResultados ? (
              <p style={{ color: '#666', textAlign: 'center' }}>Buscando resultados...</p>
            ) : (
              <>
                {resultados.slice(0, 2).map((r, i) => (
                  <div key={r.chapa_id} className="card" style={{
                    backgroundColor: i === 0 ? '#E8F5E9' : '#E3F2FD',
                    border: `1px solid ${i === 0 ? '#4CAF50' : '#2196F3'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '16px', fontWeight: '700' }}>
                        {i === 0 ? '🏆 1º Lugar' : '🥈 2º Lugar'}: {r.nome}
                      </span>
                      <span style={{ fontSize: '22px', fontWeight: '900', color: i === 0 ? '#2E7D32' : '#1565C0' }}>
                        {r.percentual}%
                      </span>
                    </div>
                    <p style={{ margin: '8px 0 0', color: '#666', fontSize: '13px' }}>
                      Total de votos: {r.total_votos}
                    </p>
                  </div>
                ))}
                {resultados.length === 0 && (
                  <p style={{ textAlign: 'center', color: '#888' }}>Nenhum voto registrado.</p>
                )}
              </>
            )}
          </>
        )}
      </div>

      <Sidebar isOpen={sidebarAberta} onClose={() => setSidebarAberta(false)} />
    </div>
  )
}
