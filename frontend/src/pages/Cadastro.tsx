import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/api'

export default function Cadastro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    matricula: '',
    nome: '',
    email: '',
    senha: '',
    confirmar_senha: '',
    tipo: 'eleitor' as 'admin' | 'eleitor',
    instituicao_id: 1
  })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    if (form.senha !== form.confirmar_senha) {
      setErro('As senhas não coincidem')
      return
    }

    setCarregando(true)
    try {
      await authService.cadastro(form)
      navigate('/login')
    } catch (err: any) {
      setErro(err.response?.data?.detail || 'Erro ao cadastrar')
    } finally {
      setCarregando(false)
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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0D1B6E',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>

        {/* Título */}
        <h2 style={{ color: 'white', fontSize: '22px', marginBottom: '20px' }}>
          Cadastre-se
        </h2>

        {/* Tabs tipo */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => setForm({ ...form, tipo: 'admin' })}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: form.tipo === 'admin' ? '#FF4500' : 'transparent',
              border: '1px solid #ccc',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Administrador
          </button>
          <button
            onClick={() => setForm({ ...form, tipo: 'eleitor' })}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: form.tipo === 'eleitor' ? '#FF4500' : 'transparent',
              border: '1px solid #ccc',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Eleitor
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Matrícula */}
          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>Matrícula</label>
            <input
              type="text"
              placeholder="Digite sua matrícula"
              value={form.matricula}
              onChange={e => setForm({ ...form, matricula: e.target.value })}
              style={inputStyle}
              required
            />
          </div>

          {/* Nome */}
          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>Nome</label>
            <input
              type="text"
              placeholder="Digite seu nome completo"
              value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })}
              style={inputStyle}
              required
            />
          </div>

          {/* Instituição */}
          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>Instituição</label>
            <input
              type="text"
              placeholder="Nome da instituição"
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="Digite seu email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={inputStyle}
              required
            />
          </div>

          {/* Senha */}
          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={form.senha}
              onChange={e => setForm({ ...form, senha: e.target.value })}
              style={inputStyle}
              required
            />
          </div>

          {/* Confirmar senha */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Confirmar senha</label>
            <input
              type="password"
              placeholder="Confirme sua senha"
              value={form.confirmar_senha}
              onChange={e => setForm({ ...form, confirmar_senha: e.target.value })}
              style={inputStyle}
              required
            />
          </div>

          {/* Erro */}
          {erro && (
            <div style={{
              backgroundColor: '#ff4444',
              color: 'white',
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '15px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {erro}
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={carregando}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#1a7a1a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: carregando ? 'not-allowed' : 'pointer',
              marginBottom: '15px'
            }}
          >
            {carregando ? 'Cadastrando...' : 'Cadastrar'}
          </button>

          {/* Voltar */}
          <p style={{ color: 'white', textAlign: 'center', fontSize: '13px' }}>
            Já tem conta?{' '}
            <Link to="/login" style={{ color: '#FF4500' }}>
              Voltar
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}