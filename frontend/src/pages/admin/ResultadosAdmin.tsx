import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService } from '../../services/api'
import Sidebar from '../../components/Sidebar'

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
  const [sidebarAberta, setSidebarAberta] = useState(false)
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

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
    <div className="page-shell">
      <div className="page-header">
        <h1>Portal Do <span>Voto</span></h1>
        <button onClick={() => setSidebarAberta(true)} className="profile-toggle" style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#FF3D00', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {usuario.nome?.charAt(0).toUpperCase() || '?'}
        </button>
      </div>

      <div className="page-card">
        <div className="page-card-center">
          <h2 className="page-title">Resultados parciais</h2>

          {carregando ? (
            <p style={{ color: '#475569' }}>Carregando...</p>
          ) : resultados.length === 0 ? (
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: '12px' }}>Nada criado ainda</h3>
              <p style={{ color: '#64748B', marginBottom: '20px' }}>
                Cadastre uma eleição ou chapas primeiro para ver resultados administrativos.
              </p>
              <button onClick={() => navigate('/admin/eleicoes')} className="button-primary" style={{ backgroundColor: '#3A8C3F' }}>
                Criar eleição
              </button>
            </div>
          ) : (
            resultados.map(eleicao => (
              <div key={eleicao.eleicao_id} className="card" style={{ marginBottom: '20px' }}>
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
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${chapa.percentual}%`, backgroundColor: index === 0 ? '#FFD700' : '#1A5A8A' }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))
          )}

          <button onClick={() => navigate('/admin')} className="button-secondary button-block" style={{ marginTop: '10px', backgroundColor: '#8A1A1A' }}>
            Voltar
          </button>
        </div>
      </div>

      <Sidebar isOpen={sidebarAberta} onClose={() => setSidebarAberta(false)} />
    </div>
  )
}