import { Pacote } from './pacote.model';
import { Carregamento } from './carregamento.model';

export interface CarregamentoPacote {
  id?: number;
  carregamento?: Carregamento;
  pacote: Pacote;
  quantidade: number;
}
