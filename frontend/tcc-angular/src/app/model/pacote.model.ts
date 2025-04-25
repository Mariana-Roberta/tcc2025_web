export interface Pacote {
  id?: number;
  nome: string;
  comprimento: number;
  largura: number;
  altura: number;
  peso: number;
  usuario: {
    id: number;
  };
}
