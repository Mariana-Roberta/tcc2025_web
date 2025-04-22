export type Perfil = 'ADMIN' | 'OPERADOR' | 'CLIENTE';

export interface Usuario {
  cnpj: string;
  razaoSocial: string;
  telefone: string;
  email: string;
  password: string;
}
