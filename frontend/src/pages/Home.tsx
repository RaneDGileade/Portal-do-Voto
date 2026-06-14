import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { eleicaoService } from '../services/api'
import Sidebar from '../components/Sidebar'
import type { Eleicao, Usuario } from '../types'

export default function Home() {
  const navigate = useNavigate()
  const [eleicaoSelecionada, setEleicaoSelecionada] = useState<Eleicao | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erroEleicao, setErroEleicao] = useState('')
  const [sidebarAberta, setSidebarAberta] = useState(false)
  const usuario: Usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  useEffect(() => {
    const storedId = Number(localStorage.getItem('eleicaoSelecionada') || '0')
    const carregarEleicao = async () => {
      try {
        if (storedId) {
          const eleicao = await eleicaoService.buscar(storedId)
          setEleicaoSelecionada(eleicao)
          return
        }
        const eleicoesAtivas = await eleicaoService.listarAtivas()
        if (eleicoesAtivas.length > 0) {
          setEleicaoSelecionada(eleicoesAtivas[0])
          return
        }
        setErroEleicao('Nenhuma eleição ativa encontrada.')
      } catch {
        setErroEleicao('Erro ao carregar a eleição. Faça login novamente.')
      } finally {
        setCarregando(false)
      }
    }
    carregarEleicao()
  }, [])

  const menus = [
    { label: 'Votar', cor: '#E8A020', rota: eleicaoSelecionada ? `/votacao/${eleicaoSelecionada.id}` : '#', disabled: !eleicaoSelecionada || eleicaoSelecionada.status !== 'ativa' },
    { label: 'Ver candidatos', cor: '#3A8C3F', rota: eleicaoSelecionada ? `/candidatos/${eleicaoSelecionada.id}` : '#', disabled: !eleicaoSelecionada },
    { label: 'Ver resultados', cor: '#2B6CB0', rota: eleicaoSelecionada ? `/resultados/${eleicaoSelecionada.id}` : '#', disabled: !eleicaoSelecionada },
    { label: 'Eleições participadas', cor: '#9B5BA5', rota: '/participadas', disabled: false },
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
            backgroundColor: '#2B6CB0', color: 'white', border: 'none',
            cursor: 'pointer', fontSize: '16px', fontWeight: '700',
            fontFamily: 'Poppins, sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          {usuario.nome?.charAt(0).toUpperCase() || '?'}
        </button>
      </div>

      <div className="page-card">
        <p style={{ color: '#333', fontSize: '16px' }}>
          Olá, <strong>{usuario.nome}</strong>! Selecione uma opção:
        </p>

        {carregando ? (
          <p style={{ color: '#666', fontSize: '15px' }}>Carregando eleição...</p>
        ) : erroEleicao ? (
          <div className="alert-box error">
            <strong>Eleição não localizada.</strong>
            <p style={{ margin: '6px 0 0', fontSize: '13px' }}>{erroEleicao}</p>
          </div>
        ) : eleicaoSelecionada ? (
          <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: '#E2E8F0' }}>
            <p style={{ margin: 0, color: '#1A202C', fontSize: '13px' }}>Eleição selecionada</p>
            <h2 style={{ margin: '6px 0 0', color: '#2D3748', fontSize: '18px' }}>{eleicaoSelecionada.titulo}</h2>
            <p style={{ margin: '6px 0 0', color: '#4A5568', fontSize: '13px' }}>
              Status: <strong>{eleicaoSelecionada.status === 'ativa' ? 'Ativa' : eleicaoSelecionada.status === 'encerrada' ? 'Encerrada' : 'Rascunho'}</strong>
            </p>
          </div>
        ) : null}

        <div className="home-menu-grid">
        {menus.map((menu, i) => (
          <button
            key={i}
            onClick={() => !menu.disabled && navigate(menu.rota)}
            disabled={menu.disabled}
            className="button-primary button-block"
            style={{
              backgroundColor: menu.cor, color: '#000',
              textAlign: 'left', padding: '28px 24px',
              fontSize: '20px', fontWeight: 800, borderRadius: '18px',
              opacity: menu.disabled ? 0.5 : 1,
              cursor: menu.disabled ? 'not-allowed' : 'pointer'
            }}
          >
            {menu.label}
          </button>
        ))}
        </div>
      </div>

      <Sidebar isOpen={sidebarAberta} onClose={() => setSidebarAberta(false)} />
    </div>
  )
}
