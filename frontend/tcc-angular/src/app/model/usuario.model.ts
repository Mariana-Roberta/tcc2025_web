export type Perfil = 'ADMIN' | 'OPERADOR' | 'CLIENTE';

export interface Usuario {
  id?: number;
  email: string;
  password: string;
  status: boolean;
  perfil: string;
  cnpj: string;
  razaoSocial: string;
  telefone: string;
}
