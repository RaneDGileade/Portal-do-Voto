import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService } from '../../services/api'
import Sidebar from '../../components/Sidebar'

export default function Dashboard() {
  const navigate = useNavigate()
  const [painel, setPainel] = useState({ total_chapas: 0, total_eleitores: 0, eleicoes_ativas: 0, eleicoes_encerradas: 0 })
  const [sidebarAberta, setSidebarAberta] = useState(false)
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  useEffect(() => {
    adminService.painel().then(setPainel).catch(console.error)
  }, [])

  const menus = [
    { label: 'Cadastrar chapas e candidatos', cor: '#E8A020', rota: '/admin/chapas' },
    { label: 'Criar eleição', cor: '#3A8C3F', rota: '/admin/eleicoes' },
    { label: 'Resultados', cor: '#2B6CB0', rota: '/admin/resultados' },
    { label: 'Painel Administrativo', cor: '#9B5BA5', rota: '/admin/painel' },
  ]

  return (
    <div className="page-shell">
      <div className="page-header">
        <h1>Portal do <span>Voto</span></h1>
        <button
          onClick={() => setSidebarAberta(true)}
          className="profile-toggle"
          style={{
            width: '38px', height: '38px', borderRadius: '50%',
            backgroundColor: '#FF3D00', color: 'white', border: 'none',
            cursor: 'pointer', fontSize: '16px', fontWeight: '700',
            fontFamily: 'Poppins, sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          {usuario.nome?.charAt(0).toUpperCase() || '?'}
        </button>
      </div>

      <div className="page-card">
        <div className="page-card-center">
          {menus.map((menu, i) => (
            <button
              key={i}
              onClick={() => navigate(menu.rota)}
              className="button-primary button-block"
              style={{
                backgroundColor: menu.cor, color: '#000',
                textAlign: 'left', padding: '28px 24px',
                fontSize: '20px', fontWeight: 800, borderRadius: '18px',
                marginBottom: '14px'
              }}
            >
              {menu.label}
            </button>
          ))}

          <div className="panel-grid" style={{ marginTop: '10px' }}>
            {[
              { label: 'Chapas cadastradas', valor: painel.total_chapas, cor: '#E8A020' },
              { label: 'Total de eleitores', valor: painel.total_eleitores, cor: '#3A8C3F' },
              { label: 'Eleições ativas', valor: painel.eleicoes_ativas, cor: '#2B6CB0' },
              { label: 'Eleições encerradas', valor: painel.eleicoes_encerradas, cor: '#9B5BA5' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ backgroundColor: item.cor, color: '#000' }}>
                <span style={{ fontSize: '15px', fontWeight: 600 }}>{item.label}</span>
                <span style={{ fontSize: '26px', fontWeight: 900 }}>{item.valor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Sidebar isOpen={sidebarAberta} onClose={() => setSidebarAberta(false)} />
    </div>
  )
}
