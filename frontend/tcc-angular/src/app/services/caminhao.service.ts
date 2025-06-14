import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Caminhao } from '../model/caminhao.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CaminhaoService {

  private baseUrl = 'http://localhost:8080/api/caminhoes';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  listarTodos(): Observable<Caminhao[]> {
    return this.http.get<Caminhao[]>(this.baseUrl, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  listarPorUsuario(idUsuario: number): Observable<Caminhao[]> {
    return this.http.get<Caminhao[]>(`${this.baseUrl}/usuario/${idUsuario}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  buscarPorId(id: number): Observable<Caminhao> {
    return this.http.get<Caminhao>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  salvar(caminhao: Caminhao): Observable<Caminhao> {
    return this.http.post<Caminhao>(this.baseUrl, caminhao, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  atualizar(id: number, caminhao: Caminhao): Observable<Caminhao> {
    return this.http.put<Caminhao>(`${this.baseUrl}/${id}`, caminhao, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erro inesperado ao processar o caminhão.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro do cliente: ${error.error.message}`;
    } else {
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
