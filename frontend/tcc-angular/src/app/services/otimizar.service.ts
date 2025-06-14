import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  private readonly apiUrl = 'http://localhost:8080/api/otimizacao';

  constructor(private http: HttpClient) {}

  otimizar(caminhaoPacotes: any): Observable<PacoteOtimizado[]> {
    return this.http.post<PacoteOtimizado[]>(this.apiUrl, caminhaoPacotes)
      .pipe(catchError(this.handleError));
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
