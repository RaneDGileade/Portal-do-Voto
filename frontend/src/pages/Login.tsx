import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService, eleicaoService } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const [tipo, setTipo] = useState<'admin' | 'usuario'>('usuario')
  const [form, setForm] = useState({ nome: '', senha: '', nomeEleicao: '' })
  const [usarNomeEleicao, setUsarNomeEleicao] = useState(false)
  const [animCounter, setAnimCounter] = useState(0)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const formRef = useRef<HTMLFormElement | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      if (tipo === 'usuario' && usarNomeEleicao && form.nomeEleicao.trim()) {
        const eleicoes = await eleicaoService.buscarPorTitulo(form.nomeEleicao.trim())
        if (!eleicoes || eleicoes.length === 0) {
          setErro('Eleição não encontrada')
          setCarregando(false)
          return
        }
        const eleicaoSelecionada = eleicoes[0]
        localStorage.setItem('eleicaoSelecionada', String(eleicaoSelecionada.id))
        localStorage.setItem('eleicaoSelecionadaTitulo', eleicaoSelecionada.titulo)
      } else if (tipo === 'admin') {
        localStorage.removeItem('eleicaoSelecionada')
        localStorage.removeItem('eleicaoSelecionadaTitulo')
      }

      const tipoLogin = tipo === 'usuario' ? 'eleitor' : 'admin'
      const data = await authService.login({
        nome: form.nome,
        senha: form.senha,
        tipo: tipoLogin,
        nomeEleicao: usarNomeEleicao ? form.nomeEleicao : undefined
      })
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

  useEffect(() => {
    setAnimCounter(c => c + 1)
    setUsarNomeEleicao(false)
    setForm(f => ({ ...f, nomeEleicao: '' }))
  }, [tipo])

  useEffect(() => {
    const root = formRef.current
    if (!root) return
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('.slide-in'))
    nodes.forEach(n => { n.style.animation = 'none' })
    void root.offsetHeight
    nodes.forEach(n => { n.style.animation = '' })
  }, [animCounter])

  return (
    <div className="auth-page" style={{
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

      <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* Nome */}
        <div className="slide-in delay-0" key={tipo}>
          <label style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '8px' }}>
            nome
          </label>
          <input
            className="input-field"
            type="text"
            value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })}
            required
          />
        </div>

        {/* Campo dinâmico por tipo */}
        {tipo === 'usuario' ? (
          <div className="slide-in delay-1" key={`dynamic-${tipo}-${animCounter}`}>
            {/* Checkbox + label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <input
                type="checkbox"
                id="usar-eleicao"
                checked={usarNomeEleicao}
                onChange={e => {
                  setUsarNomeEleicao(e.target.checked)
                  if (!e.target.checked) setForm(f => ({ ...f, nomeEleicao: '' }))
                }}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#FF3D00' }}
              />
              <label
                htmlFor="usar-eleicao"
                style={{ color: 'white', fontSize: '16px', cursor: 'pointer', userSelect: 'none' }}
              >
                nome da eleição
              </label>
            </div>
            <input
              className="input-field"
              type="text"
              placeholder="Digite o nome da eleição..."
              disabled={!usarNomeEleicao}
              value={form.nomeEleicao}
              onChange={e => setForm({ ...form, nomeEleicao: e.target.value })}
              style={{
                opacity: usarNomeEleicao ? 1 : 0.35,
                cursor: usarNomeEleicao ? 'text' : 'not-allowed',
                transition: 'opacity 0.2s'
              }}
            />
          </div>
        ) : null}

        {/* Senha */}
        <div className="slide-in delay-2" key="senha-field">
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
