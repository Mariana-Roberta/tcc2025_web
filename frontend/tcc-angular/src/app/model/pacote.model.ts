export interface Pacote {
  id?: number;
  nome: string;
  comprimento: number;
  largura: number;
  altura: number;
  peso: number;
  fragil: boolean;
  rotacao: boolean;
  usuario: {
    id: number;
  };
}
