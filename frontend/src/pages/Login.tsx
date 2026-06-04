import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ matricula: '', senha: '' })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      const data = await authService.login(form)
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      if (data.usuario.tipo === 'admin') {
        navigate('/admin')
      } else {
        navigate('/home')
      }
    } catch (err: any) {
      setErro('Matrícula ou senha inválidas')
    } finally {
      setCarregando(false)
    }
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
      <div style={{
        backgroundColor: '#0D1B6E',
        width: '100%',
        maxWidth: '380px',
      }}>
        {/* Logo */}
        <h1 style={{
          textAlign: 'center',
          color: 'white',
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '30px'
        }}>
          Portal Do <span style={{ color: '#FF4500' }}>Voto</span>
        </h1>

        <h2 style={{ color: 'white', fontSize: '20px', marginBottom: '20px' }}>
          Login
        </h2>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button style={{
            flex: 1,
            padding: '8px',
            backgroundColor: 'transparent',
            border: '1px solid #ccc',
            color: '#ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Administrador
          </button>
          <button style={{
            flex: 1,
            padding: '8px',
            backgroundColor: 'transparent',
            border: '1px solid #ccc',
            color: '#ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Eleitor
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Matrícula */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: 'white', fontSize: '14px', display: 'block', marginBottom: '5px' }}>
              Matrícula
            </label>
            <input
              type="text"
              placeholder="Digite sua matrícula"
              value={form.matricula}
              onChange={e => setForm({ ...form, matricula: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#1a2a8a',
                color: 'white',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Nome da instituição */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: 'white', fontSize: '14px', display: 'block', marginBottom: '5px' }}>
              Nome da instituição
            </label>
            <input
              type="text"
              placeholder="Digite sua instituição"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#1a2a8a',
                color: 'white',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Senha */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ color: 'white', fontSize: '14px', display: 'block', marginBottom: '5px' }}>
              Senha
            </label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={form.senha}
              onChange={e => setForm({ ...form, senha: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#1a2a8a',
                color: 'white',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Esqueceu senha */}
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <Link to="/redefinir-senha" style={{ color: '#ccc', fontSize: '12px' }}>
              Esqueceu a senha?
            </Link>
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

          {/* Botão Entrar */}
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
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>

          {/* Cadastro */}
          <p style={{ color: 'white', textAlign: 'center', fontSize: '13px' }}>
            Ainda não possui conta?{' '}
            <Link to="/cadastro" style={{ color: '#FF4500' }}>
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}