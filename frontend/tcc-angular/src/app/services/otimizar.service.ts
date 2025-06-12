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
}

@Injectable({
  providedIn: 'root'
})
export class OtimizarService {
  private readonly apiUrl = 'http://localhost:8080/api/otimizacao';

  constructor(private http: HttpClient) {}

  otimizar(caminhaoPacotes: any): Observable<PacoteOtimizado[]> {
    return this.http.post<PacoteOtimizado[]>(this.apiUrl, caminhaoPacotes)
      .pipe(catchError(this.tratarRespostaErro));
  }

  private tratarRespostaErro(error: HttpErrorResponse): Observable<never> {
    const mensagem = error?.error?.message || 'Erro inesperado na otimização.';
    return throwError(() => new Error(mensagem));
  }

    private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido.';
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      errorMessage = error.error.message; // A mensagem do Spring Boot será recebida aqui
    }
    return throwError(() => errorMessage);
  }
}
