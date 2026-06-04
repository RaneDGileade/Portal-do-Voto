import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { eleicaoService } from '../services/api'
import { Eleicao, Usuario } from '../types'

export default function Home() {
  const navigate = useNavigate()
  const [eleicoes, setEleicoes] = useState<Eleicao[]>([])
  const [carregando, setCarregando] = useState(true)
  const usuario: Usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  useEffect(() => {
    carregarEleicoes()
  }, [])

  const carregarEleicoes = async () => {
    try {
      const data = await eleicaoService.listarAtivas()
      setEleicoes(data)
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

      {/* Conteúdo */}
      <div style={{ padding: '20px' }}>
        <p style={{ color: 'white', marginBottom: '20px', fontSize: '16px' }}>
          Olá, <strong>{usuario.nome}</strong>!
        </p>

        <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '15px' }}>
          Eleições disponíveis
        </h2>

        {carregando ? (
          <p style={{ color: '#ccc' }}>Carregando...</p>
        ) : eleicoes.length === 0 ? (
          <div style={{
            backgroundColor: '#1a2a8a',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#ccc' }}>Nenhuma eleição ativa no momento.</p>
          </div>
        ) : (
          eleicoes.map(eleicao => (
            <div
              key={eleicao.id}
              style={{
                backgroundColor: '#1a2a8a',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '15px'
              }}
            >
              <h3 style={{ color: 'white', margin: '0 0 8px 0' }}>
                {eleicao.titulo}
              </h3>
              <p style={{ color: '#ccc', fontSize: '13px', margin: '0 0 15px 0' }}>
                {new Date(eleicao.inicio).toLocaleDateString('pt-BR')} até{' '}
                {new Date(eleicao.fim).toLocaleDateString('pt-BR')}
              </p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => navigate(`/candidatos/${eleicao.id}`)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#1a5a8a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Ver candidatos
                </button>
                <button
                  onClick={() => navigate(`/votacao/${eleicao.id}`)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#1a7a1a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Votar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}