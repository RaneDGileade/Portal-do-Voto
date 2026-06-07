import axios from 'axios'
import type { Token, LoginForm, CadastroForm } from '../types'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor — adiciona token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor — redireciona para login se token expirar
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const authService = {
  login: async (dados: LoginForm): Promise<Token> => {
    const response = await api.post('/auth/login', dados)
    return response.data
  },

  cadastro: async (dados: CadastroForm) => {
    const response = await api.post('/auth/cadastro', dados)
    return response.data
  },

  redefinirSenha: async (email: string) => {
    const response = await api.post('/auth/redefinir-senha', { email })
    return response.data
  },

  verificarCodigo: async (email: string, codigo: string, nova_senha: string) => {
    const response = await api.post('/auth/verificar-codigo', {
      email,
      codigo,
      nova_senha
    })
    return response.data
  },
}

// Eleições
export const eleicaoService = {
  listar: async () => {
    const response = await api.get('/eleicoes/')
    return response.data
  },

  listarAtivas: async () => {
    const response = await api.get('/eleicoes/ativas')
    return response.data
  },

  buscar: async (id: number) => {
    const response = await api.get(`/eleicoes/${id}`)
    return response.data
  },

  buscarPorTitulo: async (titulo: string) => {
    const response = await api.get('/eleicoes/buscar-por-titulo', {
      params: { titulo }
    })
    return response.data
  },

  criar: async (dados: any) => {
    const response = await api.post('/eleicoes/', dados)
    return response.data
  },

  atualizar: async (id: number, dados: any) => {
    const response = await api.put(`/eleicoes/${id}`, dados)
    return response.data
  },

  deletar: async (id: number) => {
    const response = await api.delete(`/eleicoes/${id}`)
    return response.data
  },

  resultado: async (id: number) => {
    const response = await api.get(`/eleicoes/${id}/resultado`)
    return response.data
  },
}

// Chapas
export const chapaService = {
  listar: async () => {
    const response = await api.get('/chapas/')
    return response.data
  },

  listarPorEleicao: async (eleicaoId: number) => {
    const response = await api.get(`/chapas/eleicao/${eleicaoId}`)
    return response.data
  },

  buscar: async (id: number) => {
    const response = await api.get(`/chapas/${id}`)
    return response.data
  },

  criar: async (dados: any) => {
    const response = await api.post('/chapas/', dados)
    return response.data
  },

  atualizar: async (id: number, dados: any) => {
    const response = await api.put(`/chapas/${id}`, dados)
    return response.data
  },

  deletar: async (id: number) => {
    const response = await api.delete(`/chapas/${id}`)
    return response.data
  },
}

// Votos
export const votoService = {
  votar: async (chapa_id: number, eleicao_id: number) => {
    const response = await api.post('/votos/', { chapa_id, eleicao_id })
    return response.data
  },

  verificarVoto: async (eleicao_id: number) => {
    const response = await api.get(`/votos/meu-voto/${eleicao_id}`)
    return response.data
  },
}

// Admin
export const adminService = {
  painel: async () => {
    const response = await api.get('/admin/painel')
    return response.data
  },

  listarEleitores: async () => {
    const response = await api.get('/admin/eleitores')
    return response.data
  },

  resultadosParciais: async () => {
    const response = await api.get('/admin/resultados')
    return response.data
  },
}

export default api