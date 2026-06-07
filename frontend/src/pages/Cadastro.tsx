import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/api'

export default function Cadastro() {
  const navigate = useNavigate()
  const [tipo, setTipo] = useState<'admin' | 'eleitor'>('eleitor')
  const [form, setForm] = useState({
    matricula: '',
    nome: '',
    email: '',
    senha: '',
    confirmar_senha: '',
    instituicao_id: 1,
    dataNascimento: ''
  })
  const [animCounter, setAnimCounter] = useState(0)
  const formRef = useRef<HTMLFormElement | null>(null)
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
      await authService.cadastro({ ...form, tipo })
      navigate('/login')
    } catch (err: any) {
      setErro(err.response?.data?.detail || 'Erro ao cadastrar')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    setAnimCounter(c => c + 1)
  }, [tipo])

  useEffect(() => {
    const root = formRef.current
    if (!root) return
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('.slide-in'))
    if (nodes.length === 0) return
    nodes.forEach(n => { n.style.animation = 'none' })
    void root.offsetHeight
    nodes.forEach(n => { n.style.animation = '' })
  }, [animCounter])

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0D1B6E',
      display: 'flex',
      flexDirection: 'column',
      padding: '40px 30px'
    }}>
      <h2 style={{ fontSize: '32px', fontWeight: '700', color: 'white', marginBottom: '30px' }}>
        Cadastre-se
      </h2>

      {/* Tipo conta */}
      <p style={{ color: 'white', fontSize: '16px', marginBottom: '12px' }}>tipo do conta:</p>
      <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
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
            checked={tipo === 'eleitor'}
            onChange={() => setTipo('eleitor')}
          />
          Usuário
        </label>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Nome */}
        <div className="slide-in delay-0">
          <label style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '8px' }}>nome</label>
          <input
            className="input-field"
            type="text"
            value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value, matricula: e.target.value })}
            required
          />
        </div>

        {/* Data nascimento — só admin */}
        {tipo === 'admin' && (
          <div className="slide-in delay-1" key={`admin-date-${animCounter}`}>
            <label style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '8px' }}>dd/mm/aaaa</label>
            <input
              className="input-field"
              type="date"
              value={form.dataNascimento}
              onChange={e => setForm({ ...form, dataNascimento: e.target.value })}
            />
          </div>
        )}

        {/* Email */}
        <div className="slide-in delay-2">
          <label style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '8px' }}>email</label>
          <input
            className="input-field"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        {/* Nome da instituição — só admin */}
        {tipo === 'admin' && (
          <div className="slide-in delay-3" key={`admin-inst-${animCounter}`}>
            <label style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '8px' }}>nome da instituição</label>
            <input className="input-field" type="text" />
          </div>
        )}

        {/* Senha */}
        <div className="slide-in delay-4">
          <label style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '8px' }}>senha</label>
          <input
            className="input-field"
            type="password"
            value={form.senha}
            onChange={e => setForm({ ...form, senha: e.target.value })}
            required
          />
        </div>

        {/* Confirmar senha */}
        <div className="slide-in delay-5">
          <label style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '8px' }}>confirme a senha</label>
          <input
            className="input-field"
            type="password"
            value={form.confirmar_senha}
            onChange={e => setForm({ ...form, confirmar_senha: e.target.value })}
            required
          />
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
          {carregando ? 'Cadastrando...' : 'Cadastrar'}
        </button>

        <button type="button" onClick={() => navigate('/login')} style={{
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '18px',
          fontWeight: '700',
          cursor: 'pointer',
          fontFamily: 'Poppins, sans-serif'
        }}>
          Voltar
        </button>
      </form>
    </div>
  )
}