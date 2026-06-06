import { useNavigate } from 'react-router-dom'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  const handleSair = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    onClose()
    navigate('/')
  }

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: 'white', fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>
            Portal Do <span style={{ color: '#FF3D00' }}>Voto</span>
          </h2>
        </div>

        <div style={{
          backgroundColor: '#1a2a8a',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#FF3D00',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            fontSize: '28px',
            color: 'white',
            fontWeight: '700'
          }}>
            {usuario.nome?.charAt(0).toUpperCase() || '?'}
          </div>
          <p style={{ color: 'white', fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>
            {usuario.nome || 'Usuário'}
          </p>
          <p style={{ color: '#ccc', fontSize: '13px', marginBottom: '4px' }}>
            {usuario.email || ''}
          </p>
          <span style={{
            backgroundColor: usuario.tipo === 'admin' ? '#FF3D00' : '#1a7a1a',
            color: 'white',
            padding: '3px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {usuario.tipo === 'admin' ? 'Administrador' : 'Eleitor'}
          </span>
        </div>

        <div style={{ flex: 1 }} />

        <button
          onClick={handleSair}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#FF3D00',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          Sair
        </button>
      </div>
    </>
  )
}