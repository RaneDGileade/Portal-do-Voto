import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { chapaService, eleicaoService } from '../../services/api'
import Sidebar from '../../components/Sidebar'
import { Chapa, Eleicao } from '../../types'

export default function Chapas() {
  const navigate = useNavigate()
  const [chapas, setChapas] = useState<Chapa[]>([])
  const [eleicoes, setEleicoes] = useState<Eleicao[]>([])
  const [form, setForm] = useState({
    nome: '',
    numero: '',
    foto_url: '',
    descricao: '',
    eleicao_id: 0
  })
  const [editando, setEditando] = useState<number | null>(null)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [sidebarAberta, setSidebarAberta] = useState(false)
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const [chapasData, eleicoesData] = await Promise.all([
        chapaService.listar(),
        eleicaoService.listar()
      ])
      setChapas(chapasData)
      setEleicoes(eleicoesData)
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
        await chapaService.atualizar(editando, form)
        setSucesso('Chapa atualizada com sucesso!')
      } else {
        await chapaService.criar(form)
        setSucesso('Chapa cadastrada com sucesso!')
      }
      setForm({ nome: '', numero: '', foto_url: '', descricao: '', eleicao_id: 0 })
      setEditando(null)
      carregarDados()
    } catch (err: any) {
      setErro(err.response?.data?.detail || 'Erro ao salvar chapa')
    } finally {
      setCarregando(false)
    }
  }

  const handleEditar = (chapa: Chapa) => {
    setForm({
      nome: chapa.nome,
      numero: chapa.numero,
      foto_url: chapa.foto_url || '',
      descricao: chapa.descricao || '',
      eleicao_id: chapa.eleicao_id
    })
    setEditando(chapa.id)
  }

  const handleDeletar = async (id: number) => {
    if (!confirm('Deseja deletar esta chapa?')) return
    try {
      await chapaService.deletar(id)
      carregarDados()
    } catch (err: any) {
      setErro(err.response?.data?.detail || 'Erro ao deletar')
    }
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
          <h2 className="page-title">{editando ? 'Editar chapa' : 'Cadastro de chapas'}</h2>

          <div className="desktop-two-col">
          <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#0F172A' }}>Eleição</label>
              <select
                className="form-select"
                value={form.eleicao_id}
                onChange={e => setForm({ ...form, eleicao_id: Number(e.target.value) })}
                required
              >
                <option value={0}>Selecione uma eleição</option>
                {eleicoes.map(e => (
                  <option key={e.id} value={e.id}>{e.titulo}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#0F172A' }}>Nome da chapa</label>
              <input
                className="form-input"
                type="text"
                placeholder="Nome da chapa"
                value={form.nome}
                onChange={e => setForm({ ...form, nome: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#0F172A' }}>Número (2 dígitos)</label>
              <input
                className="form-input"
                type="text"
                placeholder="Ex: 01"
                maxLength={2}
                value={form.numero}
                onChange={e => setForm({ ...form, numero: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#0F172A' }}>URL da foto</label>
              <input
                className="form-input"
                type="text"
                placeholder="https://..."
                value={form.foto_url}
                onChange={e => setForm({ ...form, foto_url: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#0F172A' }}>Descrição</label>
              <textarea
                className="form-textarea"
                placeholder="Descrição da chapa"
                value={form.descricao}
                onChange={e => setForm({ ...form, descricao: e.target.value })}
                style={{ height: '100px' }}
              />
            </div>

            {erro && (
              <div className="alert-box error">{erro}</div>
            )}

            {sucesso && (
              <div className="alert-box success">{sucesso}</div>
            )}

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button type="submit" disabled={carregando} className="button-primary button-block" style={{ opacity: carregando ? 0.75 : 1 }}>
                {carregando ? 'Salvando...' : editando ? 'Atualizar' : 'Cadastrar'}
              </button>
              <button type="button" onClick={() => navigate('/admin')} className="button-secondary button-block" style={{ backgroundColor: '#8A1A1A' }}>
                Voltar
              </button>
            </div>
          </form>

          <div>
            <h3 className="page-title" style={{ fontSize: '20px', marginTop: '24px' }}>Chapas cadastradas</h3>
            {chapas.length === 0 ? (
              <p style={{ color: '#475569' }}>Nenhuma chapa cadastrada ainda.</p>
            ) : (
              chapas.map(chapa => (
                <div
                  key={chapa.id}
                  className="card"
                  style={{
                    backgroundColor: '#1A2A8A',
                    marginBottom: '14px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ color: 'white', margin: 0, fontSize: '17px' }}>{chapa.nome}</h4>
                      <p style={{ color: '#CBD5E1', marginTop: '6px', fontSize: '13px' }}>
                        Eleição: {eleicoes.find(e => e.id === chapa.eleicao_id)?.titulo || 'Não informado'}
                      </p>
                    </div>
                    <span className="status-badge" style={{ backgroundColor: '#8A1A1A' }}>{chapa.numero}</span>
                  </div>

                  <p style={{ color: '#ccc', marginBottom: '12px', fontSize: '13px' }}>{chapa.descricao || 'Sem descrição'}</p>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleEditar(chapa)}
                      className="button-secondary"
                      style={{ backgroundColor: '#E6A817', color: '#000', flex: 1, minWidth: '120px' }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeletar(chapa.id)}
                      className="button-secondary"
                      style={{ backgroundColor: '#8A1A1A', flex: 1, minWidth: '120px' }}
                    >
                      Deletar
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