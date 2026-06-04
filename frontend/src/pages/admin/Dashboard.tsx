import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService } from '../../services/api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [painel, setPainel] = useState({
    total_chapas: 0,
    total_eleitores: 0,
    eleicoes_ativas: 0,
    eleicoes_encerradas: 0
  })
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregarPainel()
  }, [])

  const carregarPainel = async () => {
    try {
      const data = await adminService.painel()
      setPainel(data)
    } catch (err) {
      console.error(err)
    } finally {
      setCarregando(false)
    }
  }

  const handleSair = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  const menus = [
    {
      label: 'Cadastrar chapas e candidatos',
      cor: '#e6a817',
      rota: '/admin/chapas'
    },
    {
      label: 'Criar eleição',
      cor: '#1a7a1a',
      rota: '/admin/eleicoes'
    },
    {
      label: 'Resultados',
      cor: '#1a5a8a',
      rota: '/admin/resultados'
    },
    {
      label: 'Painel Administrativo',
      cor: '#6a1a8a',
      rota: '/admin'
    },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0D1B6E',
      padding: '0'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#0a1560',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ color: 'white', fontSize: '20px', margin: 0 }}>
          Portal Do <span style={{ color: '#FF4500' }}>Voto</span>
        </h1>
        <button
          onClick={handleSair}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #ccc',
            color: '#ccc',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          Sair
        </button>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Menu */}
        {menus.map((menu, i) => (
          <button
            key={i}
            onClick={() => navigate(menu.rota)}
            style={{
              width: '100%',
              padding: '18px',
              backgroundColor: menu.cor,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '12px',
              textAlign: 'left'
            }}
          >
            {menu.label}
          </button>
        ))}

        {/* Painel contadores */}
        {!carregando && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: 'white', marginBottom: '15px' }}>
              Painel administrativo
            </h3>
            {[
              { label: 'Chapas cadastradas', valor: painel.total_chapas, cor: '#e6a817' },
              { label: 'Total de eleitores', valor: painel.total_eleitores, cor: '#1a7a1a' },
              { label: 'Eleições ativas', valor: painel.eleicoes_ativas, cor: '#1a5a8a' },
              { label: 'Eleições encerradas', valor: painel.eleicoes_encerradas, cor: '#6a1a8a' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: item.cor,
                  padding: '15px 20px',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ color: 'white', fontSize: '15px' }}>{item.label}</span>
                <span style={{
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}>
                  {item.valor}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}