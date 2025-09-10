import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

// import { environment } from '../../environments/environment'; // se preferir usar environment
const DEBUG_LOGS = true;

/** === Shape igual ao CarregamentoResponseDTO do backend === */
export interface CarregamentoResponse {
  id: number;
  dataCriacao: string; // ISO no backend; parse no componente se quiser Date
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

@Injectable({ providedIn: 'root' })
export class CarregamentoService {

  /** Ajuste se preferir usar environment.apiUrl */
  // private baseUrl = `${environment.apiUrl}/carregamentos`;
  private baseUrl = 'http://localhost:8080/api/carregamentos';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /** Bearer token */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      // Melhor falhar cedo para evitar chamadas 401 desnecessárias
      throw new Error('Usuário não autenticado: token ausente.');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
  }

  /** Tratamento de erro padrão */
  private handleError(error: HttpErrorResponse) {
    if (DEBUG_LOGS) {
      // Log técnico detalhado
      // eslint-disable-next-line no-console
      console.error('[CarregamentoService] HTTP Error:', error);
    }

    let errorMessage = 'Erro inesperado ao processar a requisição.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro do cliente: ${error.error.message}`;
    } else {
      // Prioriza mensagem enviada pelo backend
      if (error?.status === 401) {
        errorMessage = 'Sessão expirada ou inválida. Faça login novamente.';
      } else if (error?.status === 403) {
        errorMessage = 'Acesso negado.';
      } else if (typeof error?.error === 'string' && error.error.trim().length) {
        errorMessage = error.error;
      } else if (error?.error && typeof error.error === 'object' && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status === 0) {
        errorMessage = 'Servidor indisponível ou erro de conexão.';
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  // ---------------------------------------------------------------------------
  // 📋 SOMENTE LISTAGEM
  // ---------------------------------------------------------------------------

  /** Lista TODOS os carregamentos (seu endpoint público/admin) */
  listarTodos(): Observable<CarregamentoResponse[]> {
    const url = this.baseUrl;
    let headers: HttpHeaders;
    try {
      headers = this.getAuthHeaders();
    } catch (e) {
      return throwError(() => e);
    }

    if (DEBUG_LOGS) {
      // eslint-disable-next-line no-console
      console.groupCollapsed('[CarregamentoService] GET', url);
      // eslint-disable-next-line no-console
      console.log('Headers:', Object.fromEntries(headers.keys().map(k => [k, headers.get(k)])));
      // eslint-disable-next-line no-console
      console.groupEnd();
    }

    return this.http
      .get<CarregamentoResponse[]>(url, { headers })
      .pipe(
        tap(resp => {
          if (DEBUG_LOGS) {
            // eslint-disable-next-line no-console
            console.groupCollapsed('[CarregamentoService] RESP / (listarTodos)');
            // eslint-disable-next-line no-console
            console.log('Body:', resp);
            // eslint-disable-next-line no-console
            console.groupEnd();
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  /** Lista carregamentos do USUÁRIO LOGADO — usa GET /api/carregamentos/me */
  listarDoUsuarioLogado(): Observable<CarregamentoResponse[]> {
    const url = `${this.baseUrl}/me`;
    let headers: HttpHeaders;
    try {
      headers = this.getAuthHeaders();
    } catch (e) {
      return throwError(() => e);
    }

    if (DEBUG_LOGS) {
      // eslint-disable-next-line no-console
      console.groupCollapsed('[CarregamentoService] GET', url);
      // eslint-disable-next-line no-console
      console.log('Headers:', Object.fromEntries(headers.keys().map(k => [k, headers.get(k)])));
      // eslint-disable-next-line no-console
      console.groupEnd();
    }

    return this.http
      .get<CarregamentoResponse[]>(url, { headers })
      .pipe(
        tap({
          next: (resp) => {
            if (DEBUG_LOGS) {
              // eslint-disable-next-line no-console
              console.groupCollapsed('[CarregamentoService] RESP /me');
              // eslint-disable-next-line no-console
              console.log('Body:', resp);
              // eslint-disable-next-line no-console
              console.groupEnd();
            }
          },
          error: (err) => {
            if (DEBUG_LOGS) {
              // eslint-disable-next-line no-console
              console.groupCollapsed('[CarregamentoService] ERROR /me');
              // eslint-disable-next-line no-console
              console.log(err);
              // eslint-disable-next-line no-console
              console.groupEnd();
            }
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  /** (opcional) Lista por usuário específico — GET /api/carregamentos/usuario/{id} */
  listarPorUsuario(idUsuario: number): Observable<CarregamentoResponse[]> {
    const url = `${this.baseUrl}/usuario/${idUsuario}`;
    let headers: HttpHeaders;
    try {
      headers = this.getAuthHeaders();
    } catch (e) {
      return throwError(() => e);
    }

    if (DEBUG_LOGS) {
      // eslint-disable-next-line no-console
      console.groupCollapsed('[CarregamentoService] GET', url);
      // eslint-disable-next-line no-console
      console.log('Headers:', Object.fromEntries(headers.keys().map(k => [k, headers.get(k)])));
      // eslint-disable-next-line no-console
      console.groupEnd();
    }

    return this.http
      .get<CarregamentoResponse[]>(url, { headers })
      .pipe(
        tap(resp => {
          if (DEBUG_LOGS) {
            // eslint-disable-next-line no-console
            console.groupCollapsed('[CarregamentoService] RESP /usuario/:id');
            // eslint-disable-next-line no-console
            console.log('Body:', resp);
            // eslint-disable-next-line no-console
            console.groupEnd();
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  /** (opcional) Buscar por ID para detalhe */
  buscarPorId(id: number): Observable<CarregamentoResponse> {
    const url = `${this.baseUrl}/${id}`;
    let headers: HttpHeaders;
    try {
      headers = this.getAuthHeaders();
    } catch (e) {
      return throwError(() => e);
    }

    if (DEBUG_LOGS) {
      // eslint-disable-next-line no-console
      console.groupCollapsed('[CarregamentoService] GET', url);
      // eslint-disable-next-line no-console
      console.log('Headers:', Object.fromEntries(headers.keys().map(k => [k, headers.get(k)])));
      // eslint-disable-next-line no-console
      console.groupEnd();
    }

    return this.http
      .get<CarregamentoResponse>(url, { headers })
      .pipe(
        tap(resp => {
          if (DEBUG_LOGS) {
            // eslint-disable-next-line no-console
            console.groupCollapsed('[CarregamentoService] RESP /:id');
            // eslint-disable-next-line no-console
            console.log('Body:', resp);
            // eslint-disable-next-line no-console
            console.groupEnd();
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  /** (opcional) Listagem paginada, caso seu backend suporte ?page & ?size */
  listarPaginado(page = 0, size = 10): Observable<{
    content: CarregamentoResponse[];
    totalElements: number;
    totalPages: number;
  }> {
    const url = `${this.baseUrl}?page=${page}&size=${size}`;
    let headers: HttpHeaders;
    try {
      headers = this.getAuthHeaders();
    } catch (e) {
      return throwError(() => e);
    }

    if (DEBUG_LOGS) {
      // eslint-disable-next-line no-console
      console.groupCollapsed('[CarregamentoService] GET', url);
      // eslint-disable-next-line no-console
      console.log('Headers:', Object.fromEntries(headers.keys().map(k => [k, headers.get(k)])));
      // eslint-disable-next-line no-console
      console.groupEnd();
    }

    return this.http
      .get<any>(url, { headers })
      .pipe(
        map(resp => ({
          content: resp?.content ?? [],
          totalElements: resp?.totalElements ?? 0,
          totalPages: resp?.totalPages ?? 0
        })),
        tap(resp => {
          if (DEBUG_LOGS) {
            // eslint-disable-next-line no-console
            console.groupCollapsed('[CarregamentoService] RESP paginado');
            // eslint-disable-next-line no-console
            console.log('Body:', resp);
            // eslint-disable-next-line no-console
            console.groupEnd();
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }
}
