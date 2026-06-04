import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { eleicaoService } from '../../services/api'
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

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#1a2a8a',
    color: 'white',
    fontSize: '14px',
    boxSizing: 'border-box' as const
  }

  const labelStyle = {
    color: 'white',
    fontSize: '14px',
    display: 'block',
    marginBottom: '5px'
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
          {editando ? 'Editar eleição' : 'Criar eleição'}
        </h2>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>Nome da eleição</label>
            <input
              type="text"
              placeholder="Nome da eleição"
              value={form.titulo}
              onChange={e => setForm({ ...form, titulo: e.target.value })}
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>Início</label>
            <input
              type="datetime-local"
              value={form.inicio}
              onChange={e => setForm({ ...form, inicio: e.target.value })}
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>Fim</label>
            <input
              type="datetime-local"
              value={form.fim}
              onChange={e => setForm({ ...form, fim: e.target.value })}
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Status</label>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              style={inputStyle}
            >
              <option value="rascunho">Rascunho</option>
              <option value="ativa">Ativa</option>
              <option value="encerrada">Encerrada</option>
            </select>
          </div>

          {erro && (
            <div style={{
              backgroundColor: '#ff4444',
              color: 'white',
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '15px',
              fontSize: '14px'
            }}>
              {erro}
            </div>
          )}

          {sucesso && (
            <div style={{
              backgroundColor: '#1a7a1a',
              color: 'white',
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '15px',
              fontSize: '14px'
            }}>
              {sucesso}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            <button
              type="submit"
              disabled={carregando}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: '#1a7a1a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {carregando ? 'Salvando...' : editando ? 'Salvar' : 'Criar eleição'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: '#8a1a1a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              Voltar
            </button>
          </div>
        </form>

        {/* Lista eleições */}
        <h3 style={{ color: 'white', marginBottom: '15px' }}>
          Eleições ativas
        </h3>

        {eleicoes.length === 0 ? (
          <p style={{ color: '#ccc' }}>Nenhuma eleição criada ainda.</p>
        ) : (
          eleicoes.map(eleicao => (
            <div
              key={eleicao.id}
              style={{
                backgroundColor: '#1a2a8a',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '12px',
                borderLeft: `4px solid ${corStatus(eleicao.status)}`
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '8px'
              }}>
                <h4 style={{ color: 'white', margin: 0, fontSize: '15px' }}>
                  {eleicao.titulo}
                </h4>
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

              <p style={{ color: '#ccc', margin: '0 0 12px 0', fontSize: '13px' }}>
                {new Date(eleicao.inicio).toLocaleDateString('pt-BR')} →{' '}
                {new Date(eleicao.fim).toLocaleDateString('pt-BR')}
              </p>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleEditar(eleicao)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: '#e6a817',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeletar(eleicao.id)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: '#8a1a1a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Deletar
                </button>
                <button
                  onClick={() => navigate(`/resultados/${eleicao.id}`)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: '#1a5a8a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Resultados
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}