import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Splash from './pages/Splash'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import RedefinirSenha from './pages/RedefinirSenha'
import Home from './pages/Home'
import Votacao from './pages/Votacao'
import Candidatos from './pages/Candidatos'
import Resultados from './pages/Resultados'
import Participadas from './pages/Participadas'
import Dashboard from './pages/admin/Dashboard'
import Chapas from './pages/admin/Chapas'
import Eleicoes from './pages/admin/Eleicoes'
import ResultadosAdmin from './pages/admin/ResultadosAdmin'

const RotaProtegida = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" />
  return <>{children}</>
}

const RotaAdmin = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token')
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  if (!token) return <Navigate to="/login" />
  if (usuario.tipo !== 'admin') return <Navigate to="/home" />
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />

        <Route path="/home" element={
          <RotaProtegida><Home /></RotaProtegida>
        } />
        <Route path="/votacao/:eleicaoId" element={
          <RotaProtegida><Votacao /></RotaProtegida>
        } />
        <Route path="/candidatos/:eleicaoId" element={
          <RotaProtegida><Candidatos /></RotaProtegida>
        } />
        <Route path="/resultados/:eleicaoId" element={
          <RotaProtegida><Resultados /></RotaProtegida>
        } />
        <Route path="/participadas" element={
          <RotaProtegida><Participadas /></RotaProtegida>
        } />

        <Route path="/admin" element={
          <RotaAdmin><Dashboard /></RotaAdmin>
        } />
        <Route path="/admin/chapas" element={
          <RotaAdmin><Chapas /></RotaAdmin>
        } />
        <Route path="/admin/eleicoes" element={
          <RotaAdmin><Eleicoes /></RotaAdmin>
        } />
        <Route path="/admin/resultados" element={
          <RotaAdmin><ResultadosAdmin /></RotaAdmin>
        } />
        <Route path="/admin/painel" element={
          <RotaAdmin><Dashboard /></RotaAdmin>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App