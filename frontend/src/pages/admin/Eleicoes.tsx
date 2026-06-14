import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { eleicaoService } from '../../services/api'
import Sidebar from '../../components/Sidebar'
import { Eleicao } from '../../types'

export default function Eleicoes() {
  const navigate = useNavigate()
  const [eleicoes, setEleicoes] = useState<Eleicao[]>([])
  const [form, setForm] = useState({
    titulo: '',
    instituicao_id: 1,
    inicio: '',
    fim: '',
    status: 'rascunho'
  })
  const [editando, setEditando] = useState<number | null>(null)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [sidebarAberta, setSidebarAberta] = useState(false)
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  useEffect(() => {
    carregarEleicoes()
  }, [])

  const carregarEleicoes = async () => {
    try {
      const data = await eleicaoService.listar()
      setEleicoes(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setCarregando(true)
    try {
      if (editando) {
        await eleicaoService.atualizar(editando, form)
        setSucesso('Eleição atualizada com sucesso!')
      } else {
        await eleicaoService.criar(form)
        setSucesso('Eleição criada com sucesso!')
      }
      setForm({ titulo: '', instituicao_id: 1, inicio: '', fim: '', status: 'rascunho' })
      setEditando(null)
      carregarEleicoes()
    } catch (err: any) {
      setErro(err.response?.data?.detail || 'Erro ao salvar eleição')
    } finally {
      setCarregando(false)
    }
  }

  const handleEditar = (eleicao: Eleicao) => {
    setForm({
      titulo: eleicao.titulo,
      instituicao_id: eleicao.instituicao_id,
      inicio: eleicao.inicio.slice(0, 16),
      fim: eleicao.fim.slice(0, 16),
      status: eleicao.status
    })
    setEditando(eleicao.id)
  }

  const handleDeletar = async (id: number) => {
    if (!confirm('Deseja deletar esta eleição?')) return
    try {
      await eleicaoService.deletar(id)
      carregarEleicoes()
    } catch (err: any) {
      setErro(err.response?.data?.detail || 'Erro ao deletar')
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
          <h2 className="page-title">{editando ? 'Editar eleição' : 'Criar eleição'}</h2>

          <div className="desktop-two-col">
          <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#0F172A' }}>Nome da eleição</label>
              <input
                className="form-input"
                type="text"
                placeholder="Nome da eleição"
                value={form.titulo}
                onChange={e => setForm({ ...form, titulo: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#0F172A' }}>Início</label>
              <input
                className="form-input"
                type="datetime-local"
                value={form.inicio}
                onChange={e => setForm({ ...form, inicio: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#0F172A' }}>Fim</label>
              <input
                className="form-input"
                type="datetime-local"
                value={form.fim}
                onChange={e => setForm({ ...form, fim: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#0F172A' }}>Status</label>
              <select
                className="form-select"
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
              >
                <option value="rascunho">Rascunho</option>
                <option value="ativa">Ativa</option>
                <option value="encerrada">Encerrada</option>
              </select>
            </div>

            {erro && (
              <div className="alert-box error">{erro}</div>
            )}

            {sucesso && (
              <div className="alert-box success">{sucesso}</div>
            )}

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button type="submit" disabled={carregando} className="button-primary button-block" style={{ opacity: carregando ? 0.75 : 1 }}>
                {carregando ? 'Salvando...' : editando ? 'Salvar' : 'Criar eleição'}
              </button>
              <button type="button" onClick={() => navigate('/admin')} className="button-secondary button-block" style={{ backgroundColor: '#8A1A1A' }}>
                Voltar
              </button>
            </div>
          </form>

          <div>
            <h3 className="page-title" style={{ fontSize: '20px' }}>Eleições</h3>
            {eleicoes.length === 0 ? (
              <p style={{ color: '#475569' }}>Nenhuma eleição criada ainda.</p>
            ) : (
              eleicoes.map(eleicao => (
                <div
                  key={eleicao.id}
                  className="card"
                  style={{
                    backgroundColor: '#1A2A8A',
                    marginBottom: '14px',
                    borderLeft: `4px solid ${corStatus(eleicao.status)}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ color: 'white', margin: 0, fontSize: '17px' }}>{eleicao.titulo}</h4>
                      <p style={{ color: '#CBD5E1', marginTop: '6px', fontSize: '13px' }}>
                        {new Date(eleicao.inicio).toLocaleDateString('pt-BR')} →{' '}
                        {new Date(eleicao.fim).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span className="status-badge" style={{ backgroundColor: corStatus(eleicao.status) }}>{eleicao.status}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                    <button
                      onClick={() => handleEditar(eleicao)}
                      className="button-secondary"
                      style={{ backgroundColor: '#E6A817', color: '#000', flex: 1, minWidth: '140px' }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeletar(eleicao.id)}
                      className="button-secondary"
                      style={{ backgroundColor: '#8A1A1A', flex: 1, minWidth: '140px' }}
                    >
                      Deletar
                    </button>
                    <button
                      onClick={() => navigate(`/resultados/${eleicao.id}`)}
                      className="button-secondary"
                      style={{ backgroundColor: '#1A5A8A', flex: 1, minWidth: '140px' }}
                    >
                      Resultados
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          </div>{/* desktop-two-col */}
        </div>
      </div>
      <Sidebar isOpen={sidebarAberta} onClose={() => setSidebarAberta(false)} />
    </div>
  )
}