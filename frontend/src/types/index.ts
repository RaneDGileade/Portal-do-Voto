export interface Instituicao {
  id: number
  nome: string
  uf: string
  criado_em: string
}

export interface Usuario {
  id: number
  matricula: string
  nome: string
  email: string
  tipo: 'admin' | 'eleitor'
  ativo: boolean
  instituicao_id: number
  criado_em: string
}

export interface Eleicao {
  id: number
  titulo: string
  instituicao_id: number
  inicio: string
  fim: string
  status: 'rascunho' | 'ativa' | 'encerrada'
  criado_por: number
  criado_em: string
}

export interface Chapa {
  id: number
  nome: string
  numero: string
  foto_url?: string
  descricao?: string
  eleicao_id: number
  criado_em: string
}

export interface Voto {
  id: number
  usuario_id: number
  chapa_id: number
  eleicao_id: number
  votado_em: string
}

export interface Token {
  access_token: string
  token_type: string
  usuario: Usuario
}

export interface ResultadoChapa {
  chapa_id: number
  nome: string
  numero: string
  foto_url?: string
  total_votos: number
  percentual: number
}

export interface LoginForm {
  matricula: string
  senha: string
}

export interface CadastroForm {
  matricula: string
  nome: string
  email: string
  senha: string
  confirmar_senha: string
  tipo: 'admin' | 'eleitor'
  instituicao_id: number
}

export interface VotoForm {
  chapa_id: number
  eleicao_id: number
}