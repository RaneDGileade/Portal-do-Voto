import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { eleicaoService } from '../services/api'
import type { Eleicao, Usuario } from '../types'

export default function Home() {
  const navigate = useNavigate()
  const [eleicaoSelecionada, setEleicaoSelecionada] = useState<Eleicao | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erroEleicao, setErroEleicao] = useState('')
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

        setErroEleicao('Nenhuma eleição ativa encontrada. Verifique o nome da eleição no login.')
      } catch (err) {
        console.error(err)
        setErroEleicao('Erro ao carregar a eleição. Faça login novamente informando o nome correto.')
      } finally {
        setCarregando(false)
      }
    }

    carregarEleicao()
  }, [])

  const handleSair = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  const menus = [
    { label: 'Votar', cor: '#E8A020', rota: eleicaoSelecionada ? `/votacao/${eleicaoSelecionada.id}` : '#', disabled: !eleicaoSelecionada || eleicaoSelecionada.status !== 'ativa' },
    { label: 'Ver candidatos', cor: '#3A8C3F', rota: eleicaoSelecionada ? `/candidatos/${eleicaoSelecionada.id}` : '#', disabled: !eleicaoSelecionada },
    { label: 'Ver resultados', cor: '#2B6CB0', rota: eleicaoSelecionada ? `/resultados/${eleicaoSelecionada.id}` : '#', disabled: !eleicaoSelecionada },
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

        {carregando ? (
          <p style={{ color: '#666', fontSize: '16px' }}>Carregando eleição selecionada...</p>
        ) : erroEleicao ? (
          <div style={{ backgroundColor: '#F8D7DA', color: '#842029', padding: '16px', borderRadius: '12px' }}>
            <strong>Eleição não localizada.</strong>
            <p style={{ margin: '8px 0 0', fontSize: '14px' }}>{erroEleicao}</p>
          </div>
        ) : eleicaoSelecionada ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: '#E2E8F0' }}>
              <p style={{ margin: 0, color: '#1A202C', fontSize: '14px' }}>Eleição selecionada</p>
              <h2 style={{ margin: '8px 0 0', color: '#2D3748', fontSize: '20px' }}>{eleicaoSelecionada.titulo}</h2>
              <p style={{ margin: '8px 0 0', color: '#4A5568', fontSize: '14px' }}>
                Status: <strong>{eleicaoSelecionada.status === 'ativa' ? 'Ativa' : eleicaoSelecionada.status === 'encerrada' ? 'Encerrada' : 'Rascunho'}</strong>
              </p>
              {eleicaoSelecionada.status !== 'ativa' && (
                <p style={{ margin: '6px 0 0', color: '#718096', fontSize: '13px' }}>
                  Esta eleição não está ativa. Você ainda pode consultar candidatos e resultados.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '18px', borderRadius: '14px' }}>
            <p style={{ margin: 0 }}>Nenhuma eleição encontrada. Faça login novamente informando o nome correto da eleição.</p>
          </div>
        )}

        {menus.map((menu, i) => (
          <button
            key={i}
            onClick={() => menu.disabled ? undefined : navigate(menu.rota)}
            disabled={menu.disabled}
            style={{
              width: '100%',
              padding: '30px 24px',
              backgroundColor: menu.cor,
              color: '#000',
              border: 'none',
              borderRadius: '16px',
              fontSize: '20px',
              fontWeight: '800',
              cursor: menu.disabled ? 'not-allowed' : 'pointer',
              textAlign: 'left',
              opacity: menu.disabled ? 0.55 : 1,
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