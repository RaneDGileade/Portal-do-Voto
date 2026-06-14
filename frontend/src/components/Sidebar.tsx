import { useNavigate } from 'react-router-dom'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const isAdmin = usuario.tipo === 'admin'

  const handleSair = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    localStorage.removeItem('eleicaoSelecionada')
    localStorage.removeItem('eleicaoSelecionadaTitulo')
    onClose()
    navigate('/login')
  }

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>

        <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '700', marginBottom: '36px' }}>
          Portal Do <span style={{ color: '#FF3D00' }}>Voto</span>
        </h2>

        <div style={{
          backgroundColor: '#1a2a8a',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            width: '52px', height: '52px',
            borderRadius: '50%',
            backgroundColor: isAdmin ? '#FF3D00' : '#2B6CB0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '12px',
            fontSize: '24px', color: 'white', fontWeight: '700'
          }}>
            {usuario.nome?.charAt(0).toUpperCase() || '?'}
          </div>
          <p style={{ color: 'white', fontWeight: '700', fontSize: '15px', margin: '0 0 4px' }}>
            {usuario.nome || 'Usuário'}
          </p>
          <p style={{ color: '#aab4d4', fontSize: '12px', margin: '0 0 10px', wordBreak: 'break-all' }}>
            {usuario.email || ''}
          </p>
          <span style={{
            display: 'inline-block',
            backgroundColor: isAdmin ? '#FF3D00' : '#1a7a1a',
            color: 'white',
            padding: '3px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '700'
          }}>
            {isAdmin ? 'Administrador' : 'Eleitor'}
          </span>
        </div>

        <div style={{ flex: 1 }} />

        <button
          onClick={handleSair}
          style={{
            width: '100%', padding: '14px',
            backgroundColor: '#FF3D00', color: 'white',
            border: 'none', borderRadius: '12px',
            fontSize: '15px', fontWeight: '700',
            cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
          }}
        >
          Sair
        </button>
      </div>
    </>
  )
}
