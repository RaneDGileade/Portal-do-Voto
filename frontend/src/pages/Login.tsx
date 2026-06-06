import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const [tipo, setTipo] = useState<'admin' | 'usuario'>('usuario')
  const [form, setForm] = useState({ matricula: '', senha: '', nomeEleicao: '' })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      const data = await authService.login({ matricula: form.matricula, senha: form.senha })
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      if (data.usuario.tipo === 'admin') {
        navigate('/admin')
      } else {
        navigate('/home')
      }
    } catch {
      setErro('Nome ou senha inválidos')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0D1B6E',
      display: 'flex',
      flexDirection: 'column',
      padding: '40px 30px'
    }}>
      <h1 style={{ fontSize: '38px', fontWeight: '700', color: 'white', marginBottom: '50px', letterSpacing: '-1px' }}>
        Portal Do <span style={{ color: '#FF3D00' }}>Voto</span>
      </h1>

      <h2 style={{ fontSize: '32px', fontWeight: '700', color: 'white', marginBottom: '30px' }}>
        Login
      </h2>

      {/* Radio buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '25px', marginBottom: '35px' }}>
        <label className="radio-label">
          <input type="radio" name="tipo" checked={tipo === 'admin'} onChange={() => setTipo('admin')} />
          Administrador
        </label>
        <label className="radio-label">
          <input type="radio" name="tipo" checked={tipo === 'usuario'} onChange={() => setTipo('usuario')} />
          Usuário
        </label>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* Campo Nome */}
        <div className="slide-in" key={tipo}>
          <label style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '8px' }}>
            nome
          </label>
          <input
            className="input-field"
            type="text"
            value={form.matricula}
            onChange={e => setForm({ ...form, matricula: e.target.value })}
            required
          />
        </div>

        {/* Campo dinâmico por tipo */}
        {tipo === 'admin' ? (
          <div className="slide-in">
            <label style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '8px' }}>
              nome da instituição
            </label>
            <input className="input-field" type="text" />
          </div>
        ) : (
          <div className="slide-in">
            <label style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '8px' }}>
              nome da eleição
            </label>
            <input
              className="input-field"
              type="text"
              value={form.nomeEleicao}
              onChange={e => setForm({ ...form, nomeEleicao: e.target.value })}
            />
          </div>
        )}

        {/* Senha */}
        <div>
          <label style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '8px' }}>
            senha
          </label>
          <input
            className="input-field"
            type="password"
            value={form.senha}
            onChange={e => setForm({ ...form, senha: e.target.value })}
            required
          />
        </div>

        {/* Esqueceu senha */}
        <div style={{ textAlign: 'right', marginTop: '-10px' }}>
          <Link to="/redefinir-senha" style={{ color: 'white', fontSize: '14px', textDecoration: 'none' }}>
            esqueceu a senha?
          </Link>
        </div>

        {erro && (
          <div style={{
            backgroundColor: 'rgba(255,61,0,0.2)',
            border: '1px solid #FF3D00',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {erro}
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>

        <p style={{ color: 'white', textAlign: 'center', fontSize: '15px' }}>
          Ainda não possui uma conta?{' '}
          <Link to="/cadastro" style={{ color: 'white', fontWeight: 'bold', textDecoration: 'underline' }}>
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  )
}