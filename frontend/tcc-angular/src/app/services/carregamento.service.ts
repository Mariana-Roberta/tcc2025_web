import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/** === Shape retornado pelo backend === */
export interface CarregamentoResponse {
  id: number;
  dataCriacao: string;

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
 * Serviço para CRUD de Carregamentos.
 * Suporta criação, listagem, busca detalhada e exclusão.
 */
@Injectable({ providedIn: 'root' })
export class CarregamentoService {

  /**  
   * Prefixo base da API.  
   * Se você usa proxy Angular (proxy.conf.json), mantenha `/api`.  
   */
  private readonly baseUrl = '/carregamentos';

  constructor(private readonly http: HttpClient) {}

  /** Criar carregamento */
  criar(body: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, body);
  }

  /** Listar todos (admin) */
  listarTodos(): Observable<CarregamentoResponse[]> {
    return this.http.get<CarregamentoResponse[]>(this.baseUrl);
  }

  /** Listar carregamentos do usuário logado */
  listarPorUsuario(idUsuario: number): Observable<CarregamentoResponse[]> {
    return this.http.get<CarregamentoResponse[]>(
      `${this.baseUrl}/usuario/${idUsuario}`
    );
  }

  /** Buscar carregamento completo por ID */
  buscarPorId(id: number | string): Observable<CarregamentoResponse> {
    return this.http.get<CarregamentoResponse>(`${this.baseUrl}/${id}`);
  }

  /** Atualizar carregamento */
  atualizar(id: number | string, body: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, body);
  }

  /** Excluir carregamento */
  excluir(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  baixarPdf(id: number) {
    return this.http.get(`${this.baseUrl}/carregamentos/${id}/pdf`, {
      responseType: 'blob'
    });
  }

}
