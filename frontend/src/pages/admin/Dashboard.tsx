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
    <div className="page-shell">
      <div className="page-header">
        <h1>
          Portal do <span>Voto</span>
        </h1>
        <button onClick={handleSair} className="button-tertiary" style={{ fontSize: '22px' }}>
          ⎋
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
                backgroundColor: menu.cor,
                color: '#000',
                textAlign: 'left',
                padding: '28px 24px',
                fontSize: '20px',
                fontWeight: 800,
                borderRadius: '18px'
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
    </div>
  )
}