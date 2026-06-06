import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { chapaService, votoService } from '../services/api'
import type { Chapa } from '../types'

export default function Votacao() {
  const navigate = useNavigate()
  const { eleicaoId } = useParams()
  const [numero, setNumero] = useState(['', ''])
  const [chapa, setChapa] = useState<Chapa | null>(null)
  const [erro, setErro] = useState('')
  const [votado, setVotado] = useState(false)
  const [modal, setModal] = useState<'candidato' | 'branco' | null>(null)
  const [carregando, setCarregando] = useState(false)

  const handleNumero = async (n: string) => {
    const vazio = numero.findIndex(d => d === '')
    if (vazio === -1) return
    const novo = [...numero]
    novo[vazio] = n
    setNumero(novo)
    setErro('')

    if (vazio === 1) {
      const numCompleto = novo.join('')
      try {
        const chapas = await chapaService.listarPorEleicao(Number(eleicaoId))
        const encontrada = chapas.find((c: Chapa) => c.numero === numCompleto)
        if (encontrada) setChapa(encontrada)
        else { setChapa(null); setErro('Número não encontrado') }
      } catch {
        setErro('Erro ao buscar candidato')
      }
    }
  }

  const handleCorrige = () => {
    setNumero(['', ''])
    setChapa(null)
    setErro('')
  }

  const handleConfirmarVoto = async () => {
    if (!chapa) return
    setCarregando(true)
    try {
      await votoService.votar(chapa.id, Number(eleicaoId))
      setModal(null)
      setVotado(true)
    } catch (err: any) {
      setErro(err.response?.data?.detail || 'Erro ao votar')
      setModal(null)
    } finally {
      setCarregando(false)
    }
  }

  const handleConfirmarBranco = async () => {
    setCarregando(true)
    try {
      // voto em branco — sem chapa
      setModal(null)
      setVotado(true)
    } finally {
      setCarregando(false)
    }
  }

  const handleConfirmar = () => {
    if (!chapa && numero[0] === '') {
      setModal('branco')
    } else if (!chapa) {
      setErro('Número inválido')
    } else {
      setModal('candidato')
    }
  }

  // Tela voto confirmado
  if (votado) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0D1B6E', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '16px 24px', textAlign: 'center' }}>
          <h1 style={{ color: 'white', fontSize: '22px', fontWeight: '700' }}>
            Portal do <span style={{ color: '#FF3D00' }}>Voto</span>
          </h1>
        </div>

        {/* Card confirmado */}
        <div style={{
          flex: 1,
          backgroundColor: '#F0F2F5',
          borderRadius: '20px 20px 0 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 30px',
          gap: '20px'
        }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%',
            backgroundColor: '#4CAF50',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '50px', color: 'white'
          }}>
            ✓
          </div>
          <h2 style={{ color: '#4CAF50', fontSize: '28px', fontWeight: '700', textAlign: 'center' }}>
            Voto Confirmado!
          </h2>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => navigate('/home')}
            style={{
              width: '100%',
              padding: '18px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D1B6E', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '16px 24px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '22px', fontWeight: '700' }}>
          Portal do <span style={{ color: '#FF3D00' }}>Voto</span>
        </h1>
      </div>

      {/* Card candidato */}
      <div style={{ padding: '0 12px 12px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          minHeight: '180px'
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#555', fontSize: '14px', marginBottom: '12px' }}>
              voto para: <strong style={{ color: '#000' }}>Repr. de turma</strong>
            </p>
            <h3 style={{ color: '#000', fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>
              {chapa ? chapa.nome : ''}
            </h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              {numero.map((d, i) => (
                <div key={i} style={{
                  width: '52px', height: '58px',
                  border: '2px solid #333',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#000',
                  backgroundColor: '#f9f9f9'
                }}>
                  {d}
                </div>
              ))}
            </div>
            {erro && <p style={{ color: '#E53E3E', fontSize: '13px', marginTop: '8px' }}>{erro}</p>}
          </div>

          {/* Foto */}
          <div style={{
            width: '120px', height: '130px',
            backgroundColor: '#e8e8e8',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
            marginLeft: '12px'
          }}>
            {chapa?.foto_url ? (
              <img src={chapa.foto_url} alt={chapa.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: '#999', fontSize: '11px', textAlign: 'center', padding: '8px' }}>
                foto do candidato
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Teclado */}
      <div style={{ padding: '0 12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {['1','2','3','4','5','6','7','8','9'].map(n => (
          <button key={n} onClick={() => handleNumero(n)} style={{
            padding: '20px',
            backgroundColor: '#000',
            color: 'white',
            border: '1.5px solid #444',
            borderRadius: '10px',
            fontSize: '30px',
            fontWeight: '700',
            cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif'
          }}>
            {n}
          </button>
        ))}
        <div />
        <button onClick={() => handleNumero('0')} style={{
          padding: '20px',
          backgroundColor: '#000',
          color: 'white',
          border: '1.5px solid #444',
          borderRadius: '10px',
          fontSize: '30px',
          fontWeight: '700',
          cursor: 'pointer',
          fontFamily: 'Poppins, sans-serif'
        }}>
          0
        </button>
        <div />
      </div>

      {/* Botões ação */}
      <div style={{ display: 'flex', gap: '8px', padding: '12px' }}>
        <button onClick={() => setModal('branco')} style={{
          flex: 1, padding: '16px',
          backgroundColor: 'white', color: '#000',
          border: 'none', borderRadius: '10px',
          fontSize: '16px', fontWeight: '600',
          cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
        }}>
          Branco
        </button>
        <button onClick={handleCorrige} style={{
          flex: 1, padding: '16px',
          backgroundColor: '#E53E3E', color: 'white',
          border: 'none', borderRadius: '10px',
          fontSize: '16px', fontWeight: '600',
          cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
        }}>
          Corrige
        </button>
        <button onClick={handleConfirmar} style={{
          flex: 1, padding: '16px',
          backgroundColor: '#2F855A', color: 'white',
          border: 'none', borderRadius: '10px',
          fontSize: '16px', fontWeight: '600',
          cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
        }}>
          Confirmar
        </button>
      </div>

      {/* Modal voto em branco */}
      {modal === 'branco' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: '#F0F2F5',
            borderRadius: '20px',
            padding: '30px 24px',
            width: '100%',
            maxWidth: '360px'
          }}>
            <h3 style={{ color: '#000', fontSize: '22px', fontWeight: '700', textAlign: 'center', marginBottom: '8px' }}>
              confirmar seu voto?
            </h3>
            <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', marginBottom: '20px' }}>
              Voce está prestes a votar em:
            </p>
            <div style={{
              backgroundColor: '#0D1B6E',
              borderRadius: '12px',
              padding: '18px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <p style={{ color: 'white', fontSize: '18px', fontWeight: '700', letterSpacing: '1px' }}>
                VOTO EM BRANCO
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setModal(null)} style={{
                flex: 1, padding: '16px',
                backgroundColor: '#999', color: 'white',
                border: 'none', borderRadius: '12px',
                fontSize: '16px', fontWeight: '600',
                cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
              }}>
                Cancelar
              </button>
              <button onClick={handleConfirmarBranco} disabled={carregando} style={{
                flex: 1, padding: '16px',
                backgroundColor: '#2F855A', color: 'white',
                border: 'none', borderRadius: '12px',
                fontSize: '16px', fontWeight: '600',
                cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
              }}>
                Confirmar voto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal candidato */}
      {modal === 'candidato' && chapa && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: '#F0F2F5',
            borderRadius: '20px',
            padding: '30px 24px',
            width: '100%',
            maxWidth: '360px'
          }}>
            <h3 style={{ color: '#000', fontSize: '22px', fontWeight: '700', textAlign: 'center', marginBottom: '8px' }}>
              confirmar seu voto?
            </h3>
            <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', marginBottom: '20px' }}>
              Voce está prestes a votar em:
            </p>
            <div style={{
              backgroundColor: '#0D1B6E',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '6px' }}>Candidato:</p>
              <p style={{ color: 'white', fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>
                {chapa.nome}
              </p>
              <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '8px' }}>Chapa</p>
              <p style={{ color: '#F6AD55', fontSize: '22px', fontWeight: '700' }}>
                {chapa.numero}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setModal(null)} style={{
                flex: 1, padding: '16px',
                backgroundColor: '#999', color: 'white',
                border: 'none', borderRadius: '12px',
                fontSize: '16px', fontWeight: '600',
                cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
              }}>
                Cancelar
              </button>
              <button onClick={handleConfirmarVoto} disabled={carregando} style={{
                flex: 1, padding: '16px',
                backgroundColor: '#2F855A', color: 'white',
                border: 'none', borderRadius: '12px',
                fontSize: '16px', fontWeight: '600',
                cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
              }}>
                {carregando ? 'Votando...' : 'Confirmar voto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}