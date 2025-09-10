import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

interface PacoteOtimizado {
  x: number;
  y: number;
  z: number;
  comprimento: number;
  largura: number;
  altura: number;
  pacoteId: number;
  pedidoId?: number; // caso esteja usando em sua estrutura
}

@Injectable({
  providedIn: 'root'
})
export class OtimizarService {
  private readonly apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /** Gera headers com Bearer Token para autenticação */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  otimizar(body: any) {
    console.log('OTIMIZAR - body (obj):', body);
    console.log('OTIMIZAR - body (json):', JSON.stringify(body, null, 2));
    return this.http.post<any>(`${this.apiUrl}/otimizacao`, body, { headers: this.getAuthHeaders() });
  }

  criarCarregamento(body: any) {
    console.log('CRIAR CARREGAMENTO - body (obj):', body);
    console.log('CRIAR CARREGAMENTO - body (json):', JSON.stringify(body, null, 2));
    return this.http.post<any>(`${this.apiUrl}/carregamentos`, body, { headers: this.getAuthHeaders() });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erro inesperado na otimização.';

    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro do cliente: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      if (error.error && typeof error.error === 'object' && error.error.message) {
        errorMessage = error.error.message;
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.status === 403) {
        errorMessage = 'Acesso negado. Você não tem permissão para esta operação.';
      } else if (error.status === 0) {
        errorMessage = 'Servidor indisponível ou erro de conexão.';
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
