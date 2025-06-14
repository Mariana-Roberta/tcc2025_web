import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Pacote } from '../model/pacote.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PacoteService {
  private readonly baseUrl = 'http://localhost:8080/api/pacotes';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  listarPorUsuario(idUsuario: number): Observable<Pacote[]> {
    return this.http.get<Pacote[]>(`${this.baseUrl}/usuario/${idUsuario}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  buscarPorId(id: number): Observable<Pacote> {
    return this.http.get<Pacote>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  salvar(pacote: Pacote): Observable<Pacote> {
    return this.http.post<Pacote>(this.baseUrl, pacote, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  atualizar(id: number, pacote: Pacote): Observable<Pacote> {
    return this.http.put<Pacote>(`${this.baseUrl}/${id}`, pacote, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro inesperado no servidor.';

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
