export type Perfil = 'ADMIN' | 'OPERADOR' | 'CLIENTE';

export interface Usuario {
  id?: number;
  email: string;
  password: string;
  status: boolean;
  perfil: Perfil;
  dataCriacao?: string; // ISO string vinda do backend
  idPessoa: number;     // relacionamento com Pessoa
}
