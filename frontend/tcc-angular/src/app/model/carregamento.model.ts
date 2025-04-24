import { Caminhao } from './caminhao.model';
import { CarregamentoPacote } from './carregamento-pacote.model';

export interface Carregamento {
  id?: number;
  dataCriacao?: string; // ou Date se quiser converter
  caminhao: Caminhao;
  quantidadeCaminhoes?: number;
  carregamentoPacotes?: CarregamentoPacote[];
}
