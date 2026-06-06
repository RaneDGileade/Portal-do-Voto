import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const [tipo, setTipo] = useState<'admin' | 'usuario'>('usuario')
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
    } catch {
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
      flexDirection: 'column',
      padding: '40px 30px'
    }}>
      <style>{`
        .input-field {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1.5px solid rgba(255,255,255,0.4);
          color: white;
          font-size: 16px;
          padding: 8px 0;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-field:focus {
          border-bottom-color: white;
        }
        .radio-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
          font-size: 16px;
          cursor: pointer;
        }
      `}</style>

      {/* Logo */}
      <h1 style={{
        fontSize: '38px',
        fontWeight: '900',
        color: 'white',
        marginBottom: '50px',
        letterSpacing: '-1px'
      }}>
        Portal Do <span style={{ color: '#FF3D00' }}>Voto</span>
      </h1>

      {/* Login title */}
      <h2 style={{
        fontSize: '32px',
        fontWeight: '800',
        color: 'white',
        marginBottom: '30px'
      }}>
        Login
      </h2>

      {/* Radio buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '25px',
        marginBottom: '35px'
      }}>
        <label className="radio-label">
          <input
            type="radio"
            name="tipo"
            checked={tipo === 'admin'}
            onChange={() => setTipo('admin')}
          />
          Administrador
        </label>
        <label className="radio-label">
          <input
            type="radio"
            name="tipo"
            checked={tipo === 'usuario'}
            onChange={() => setTipo('usuario')}
          />
          usuário
        </label>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* Matrícula ou Nome */}
        <div>
          <label style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '8px' }}>
            {tipo === 'admin' ? 'Matrícula' : 'Nome'}
          </label>
          <input
            className="input-field"
            type="text"
            value={form.matricula}
            onChange={e => setForm({ ...form, matricula: e.target.value })}
            required
          />
        </div>

        {/* Nome da instituição */}
        <div>
          <label style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '8px' }}>
            Nome da instituição
          </label>
          <input
            className="input-field"
            type="text"
          />
        </div>

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

        {/* Erro */}
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

        {/* Botão Entrar */}
        <button
          type="submit"
          disabled={carregando}
          style={{
            width: '100%',
            padding: '18px',
            backgroundColor: '#000',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '700',
            cursor: carregando ? 'not-allowed' : 'pointer',
            marginTop: '10px',
            transition: 'opacity 0.2s'
          }}
        >
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>

        {/* Cadastro */}
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