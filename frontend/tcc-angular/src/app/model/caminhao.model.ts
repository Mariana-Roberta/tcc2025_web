export interface Caminhao {
  id?: number;
  nome: string;
  comprimento: number;
  largura: number;
  altura: number;
  pesoLimite: number;
  usuario: {
    id: number;
  };
}
