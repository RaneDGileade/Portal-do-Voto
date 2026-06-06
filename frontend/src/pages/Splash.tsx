import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Splash() {
  const navigate = useNavigate()
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOut(true), 1800)
    const timer2 = setTimeout(() => navigate('/login'), 2500)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0D1B6E',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.7s ease-in-out'
    }}>
      <style>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.8); }
          60% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .splash-logo {
          animation: fadeInScale 1s ease-in-out forwards;
        }
      `}</style>

      <h1 className="splash-logo" style={{
        fontSize: '42px',
        fontWeight: '900',
        color: 'white',
        letterSpacing: '-1px',
        textAlign: 'center'
      }}>
        Portal Do <span style={{ color: '#FF3D00' }}>Voto</span>
      </h1>
    </div>
  )
}