import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { chapaService, eleicaoService } from '../../services/api'
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
          {editando ? 'Editar chapa' : 'Cadastro de chapas'}
        </h2>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>Eleição</label>
            <select
              value={form.eleicao_id}
              onChange={e => setForm({ ...form, eleicao_id: Number(e.target.value) })}
              style={{ ...inputStyle }}
              required
            >
              <option value={0}>Selecione uma eleição</option>
              {eleicoes.map(e => (
                <option key={e.id} value={e.id}>{e.titulo}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>Nome da chapa</label>
            <input
              type="text"
              placeholder="Nome da chapa"
              value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })}
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>Número (2 dígitos)</label>
            <input
              type="text"
              placeholder="Ex: 01"
              maxLength={2}
              value={form.numero}
              onChange={e => setForm({ ...form, numero: e.target.value })}
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>URL da foto</label>
            <input
              type="text"
              placeholder="https://..."
              value={form.foto_url}
              onChange={e => setForm({ ...form, foto_url: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Descrição</label>
            <textarea
              placeholder="Descrição da chapa"
              value={form.descricao}
              onChange={e => setForm({ ...form, descricao: e.target.value })}
              style={{ ...inputStyle, height: '80px', resize: 'none' }}
            />
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
                backgroundColor: '#e6a817',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {carregando ? 'Salvando...' : editando ? 'Atualizar' : 'Cadastrar'}
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

        {/* Lista chapas */}
        <h3 style={{ color: 'white', marginBottom: '15px' }}>
          Chapas cadastradas
        </h3>

        {chapas.length === 0 ? (
          <p style={{ color: '#ccc' }}>Nenhuma chapa cadastrada ainda.</p>
        ) : (
          chapas.map(chapa => (
            <div
              key={chapa.id}
              style={{
                backgroundColor: '#1a2a8a',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              {chapa.foto_url ? (
                <img
                  src={chapa.foto_url}
                  alt={chapa.nome}
                  style={{
                    width: '55px',
                    height: '55px',
                    borderRadius: '50%',
                    objectFit: 'cover'
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
                  fontSize: '22px'
                }}>
                  👤
                </div>
              )}

              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', margin: '0 0 3px 0', fontWeight: 'bold' }}>
                  {chapa.nome}
                </p>
                <p style={{ color: '#ccc', margin: 0, fontSize: '13px' }}>
                  Número: {chapa.numero}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleEditar(chapa)}
                  style={{
                    padding: '8px 12px',
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
                  onClick={() => handleDeletar(chapa.id)}
                  style={{
                    padding: '8px 12px',
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}