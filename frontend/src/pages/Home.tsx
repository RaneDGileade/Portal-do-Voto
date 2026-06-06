import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { eleicaoService } from '../services/api'
import type { Eleicao, Usuario } from '../types'

export default function Home() {
  const navigate = useNavigate()
  const [eleicoes, setEleicoes] = useState<Eleicao[]>([])
  const usuario: Usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  useEffect(() => {
    eleicaoService.listarAtivas().then(setEleicoes).catch(console.error)
  }, [])

  const handleSair = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  const menus = [
    { label: 'Votar', cor: '#E8A020', rota: eleicoes[0] ? `/votacao/${eleicoes[0].id}` : '#' },
    { label: 'Ver candidatos', cor: '#3A8C3F', rota: eleicoes[0] ? `/candidatos/${eleicoes[0].id}` : '#' },
    { label: 'Ver resultados', cor: '#2B6CB0', rota: eleicoes[0] ? `/resultados/${eleicoes[0].id}` : '#' },
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
        <p style={{ color: '#333', fontSize: '16px', marginBottom: '10px' }}>
          Olá, <strong>{usuario.nome}</strong>! Selecione uma opção:
        </p>
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
      </div>
    </div>
  )
}