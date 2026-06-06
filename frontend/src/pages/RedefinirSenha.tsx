import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/api'

export default function RedefinirSenha() {
  const navigate = useNavigate()
  const [etapa, setEtapa] = useState<'email' | 'codigo'>('email')
  const [email, setEmail] = useState('')
  const [codigo, setCodigo] = useState(['', '', '', '', '', ''])
  const [novaSenha, setNovaSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const inputs = useRef<HTMLInputElement[]>([])

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await authService.redefinirSenha(email)
      setEtapa('codigo')
    } catch (err: any) {
      setErro(err.response?.data?.detail || 'Email não encontrado')
    } finally {
      setCarregando(false)
    }
  }

  const handleCodigo = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const novo = [...codigo]
    novo[index] = value
    setCodigo(novo)
    if (value && index < 5) inputs.current[index + 1]?.focus()
  }

  const handleVerificar = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await authService.verificarCodigo(email, codigo.join(''), novaSenha)
      navigate('/login')
    } catch (err: any) {
      setErro(err.response?.data?.detail || 'Código inválido')
    } finally {
      setCarregando(false)
    }
  }

  if (etapa === 'email') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0D1B6E',
        display: 'flex',
        flexDirection: 'column',
        padding: '60px 30px'
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: 'white',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          Redefinição de senha
        </h2>

        <p style={{
          color: 'white',
          fontSize: '16px',
          textAlign: 'center',
          marginBottom: '50px',
          lineHeight: '1.6'
        }}>
          informe seu email para que seja enviado um link para redefinição de senha.
        </p>

        <form onSubmit={handleEnviar} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div>
            <label style={{ color: 'white', fontSize: '16px', display: 'block', marginBottom: '8px' }}>
              digite seu email
            </label>
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
            {carregando ? 'Enviando...' : 'Enviar código'}
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleEnviar}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              Enviar código novamente
            </button>
            <span style={{ color: 'white' }}>|</span>
            <Link to="/login" style={{ color: 'white', fontSize: '14px', textDecoration: 'none' }}>
              Voltar ao login
            </Link>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0D1B6E',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '60px 30px'
    }}>
      <h2 style={{
        fontSize: '32px',
        fontWeight: '700',
        color: 'white',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        Verificar código
      </h2>

      <p style={{
        color: 'white',
        fontSize: '16px',
        textAlign: 'center',
        marginBottom: '40px',
        lineHeight: '1.6'
      }}>
        Digite o código de 6 dígitos enviado para seu email
      </p>

      <form
        onSubmit={handleVerificar}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}
      >
        {/* Inputs do código */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {codigo.map((digit, i) => (
            <input
              key={i}
              ref={el => { if (el) inputs.current[i] = el }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={e => handleCodigo(i, e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Backspace' && !digit && i > 0) {
                  inputs.current[i - 1]?.focus()
                }
              }}
              style={{
                width: '48px',
                height: '58px',
                borderRadius: '12px',
                border: '2px solid rgba(255,255,255,0.4)',
                backgroundColor: 'transparent',
                color: 'white',
                fontSize: '24px',
                fontWeight: '700',
                textAlign: 'center',
                outline: 'none',
                fontFamily: 'Poppins, sans-serif'
              }}
            />
          ))}
        </div>

        {erro && (
          <div style={{
            backgroundColor: 'rgba(255,61,0,0.2)',
            border: '1px solid #FF3D00',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '14px',
            textAlign: 'center',
            width: '100%'
          }}>
            {erro}
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={carregando}>
          {carregando ? 'Verificando...' : 'OK'}
        </button>

        <button
          type="button"
          onClick={() => setEtapa('email')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '18px',
            fontWeight: '700',
            cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          Voltar
        </button>
      </form>
    </div>
  )
}