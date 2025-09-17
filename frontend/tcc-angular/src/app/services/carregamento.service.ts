import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/** === Shape do Carregamento conforme backend === */
export interface CarregamentoResponse {
  id: number;
  dataCriacao: string; // ISO do backend
  caminhao: {
    id: number;
    nome?: string;
    comprimento?: number;
    largura?: number;
    altura?: number;
    pesoLimite?: number;
  };
  pedidos: Array<{
    id: number;
    descricao?: string;
    pacotes: Array<{
      id: number;
      nome?: string;
      comprimento?: number;
      largura?: number;
      altura?: number;
      peso?: number;
      fragil?: boolean;
      quantidade: number;
    }>;
  }>;
}

/**
 * Carregamentos — CRUD e filtros comuns.
 */
@Injectable({ providedIn: 'root' })
export class CarregamentoService {
  constructor(private readonly http: HttpClient) {}

  criar(body: any): Observable<any> {
    return this.http.post<any>('/carregamentos', body);
  }

  listarTodos(): Observable<CarregamentoResponse[]> {
    return this.http.get<CarregamentoResponse[]>('/carregamentos');
  }

  listarPorUsuario(idUsuario: number): Observable<CarregamentoResponse[]> {
    // Adeque ao seu endpoint real (query param ou subrota)
    return this.http.get<CarregamentoResponse[]>(`/carregamentos/usuario/${idUsuario}`);
  }

  buscarPorId(id: number): Observable<CarregamentoResponse> {
    return this.http.get<CarregamentoResponse>(`/carregamentos/${id}`);
  }

  atualizar(id: number, body: any): Observable<any> {
    return this.http.put<any>(`/carregamentos/${id}`, body);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`/carregamentos/${id}`);
  }
}
