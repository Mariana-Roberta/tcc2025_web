export interface Pacote {
  id?: number;
  nome: string;
  comprimento: number;
  largura: number;
  altura: number;
  peso: number;
  rotacao: boolean;
  usuario: {
    id: number;
  };
}
