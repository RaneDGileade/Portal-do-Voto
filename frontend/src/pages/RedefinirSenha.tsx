import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/api'

export default function RedefinirSenha() {
  const navigate = useNavigate()
  const [etapa, setEtapa] = useState<'email' | 'codigo'>('email')
  const [email, setEmail] = useState('')
  const [codigo, setCodigo] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

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

  const handleEnviarCodigo = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await authService.redefinirSenha(email)
      setSucesso('Código enviado para seu email!')
      setEtapa('codigo')
    } catch (err: any) {
      setErro(err.response?.data?.detail || 'Email não encontrado')
    } finally {
      setCarregando(false)
    }
  }

  const handleVerificarCodigo = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await authService.verificarCodigo(email, codigo, novaSenha)
      setSucesso('Senha redefinida com sucesso!')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err: any) {
      setErro(err.response?.data?.detail || 'Código inválido ou expirado')
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
      <div style={{ width: '100%', maxWidth: '380px' }}>

        {etapa === 'email' ? (
          <>
            <h2 style={{ color: 'white', fontSize: '22px', marginBottom: '20px' }}>
              Redefinir senha
            </h2>
            <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '20px' }}>
              Informe seu email para que seja enviado um link para redefinição de senha.
            </p>

            <form onSubmit={handleEnviarCodigo}>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

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

              {sucesso && (
                <div style={{
                  backgroundColor: '#1a7a1a',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '6px',
                  marginBottom: '15px',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  {sucesso}
                </div>
              )}

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
                {carregando ? 'Enviando...' : 'Enviar código'}
              </button>

              <p style={{ color: 'white', textAlign: 'center', fontSize: '13px' }}>
                <Link to="/login" style={{ color: '#FF4500' }}>
                  Voltar
                </Link>
              </p>
            </form>
          </>
        ) : (
          <>
            <h2 style={{ color: 'white', fontSize: '22px', marginBottom: '20px' }}>
              Verificar código
            </h2>
            <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '20px' }}>
              Digite o código de 5 dígitos enviado para seu email.
            </p>

            <form onSubmit={handleVerificarCodigo}>
              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>Código</label>
                <input
                  type="text"
                  placeholder="00000"
                  maxLength={5}
                  value={codigo}
                  onChange={e => setCodigo(e.target.value)}
                  style={{
                    ...inputStyle,
                    textAlign: 'center',
                    fontSize: '24px',
                    letterSpacing: '10px'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Nova senha</label>
                <input
                  type="password"
                  placeholder="Digite a nova senha"
                  value={novaSenha}
                  onChange={e => setNovaSenha(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

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

              {sucesso && (
                <div style={{
                  backgroundColor: '#1a7a1a',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '6px',
                  marginBottom: '15px',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  {sucesso}
                </div>
              )}

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
                {carregando ? 'Verificando...' : 'OK'}
              </button>

              <p style={{ color: 'white', textAlign: 'center', fontSize: '13px' }}>
                <Link to="/login" style={{ color: '#FF4500' }}>
                  Voltar
                </Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}