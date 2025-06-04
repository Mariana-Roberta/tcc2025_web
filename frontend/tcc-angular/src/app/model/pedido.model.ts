import { Pacote } from './pacote.model';

export interface Pedido {
  id?: number;
  nome: string;
  pacotes: {
    pacote: Pacote;
    quantidade: number;
    confirmado: boolean;
  }[];
}
