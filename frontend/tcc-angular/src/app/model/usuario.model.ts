export type Perfil = 'ADMIN' | 'OPERADOR' | 'CLIENTE';

export interface Usuario {
  email: string;
  password: string;
  status: boolean;
  perfil: string;
  cnpj: string;
  razaoSocial: string;
  telefone: string;
}
