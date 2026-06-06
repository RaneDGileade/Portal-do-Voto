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

  useEffect(() => {
    adminService.painel().then(setPainel).catch(console.error)
  }, [])

  const handleSair = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  const menus = [
    { label: 'Cadastrar chapas e candidatos', cor: '#E8A020', rota: '/admin/chapas' },
    { label: 'Criar eleição', cor: '#3A8C3F', rota: '/admin/eleicoes' },
    { label: 'Resultados', cor: '#2B6CB0', rota: '/admin/resultados' },
    { label: 'Painel Administrativo', cor: '#9B5BA5', rota: '/admin/painel' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D1B6E', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '900' }}>
          Portal do <span style={{ color: '#FF3D00' }}>Voto</span>
        </h1>
        <button onClick={handleSair} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'white', fontSize: '22px' }}>
          ⎋
        </button>
      </div>

      <div style={{ flex: 1, backgroundColor: '#F0F2F5', borderRadius: '20px 20px 0 0', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {menus.map((menu, i) => (
          <button
            key={i}
            onClick={() => navigate(menu.rota)}
            style={{
              width: '100%',
              padding: '30px 24px',
              backgroundColor: menu.cor,
              color: '#000',
              border: 'none',
              borderRadius: '16px',
              fontSize: '20px',
              fontWeight: '800',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'opacity 0.2s'
            }}
          >
            {menu.label}
          </button>
        ))}

        {/* Painel contadores */}
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { label: 'Chapas cadastradas', valor: painel.total_chapas, cor: '#E8A020' },
            { label: 'Total de eleitores', valor: painel.total_eleitores, cor: '#3A8C3F' },
            { label: 'Eleições ativas', valor: painel.eleicoes_ativas, cor: '#2B6CB0' },
            { label: 'Eleições encerradas', valor: painel.eleicoes_encerradas, cor: '#9B5BA5' },
          ].map((item, i) => (
            <div key={i} style={{
              backgroundColor: item.cor,
              padding: '15px 20px',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#000', fontSize: '15px', fontWeight: '600' }}>{item.label}</span>
              <span style={{ color: '#000', fontSize: '26px', fontWeight: '900' }}>{item.valor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}