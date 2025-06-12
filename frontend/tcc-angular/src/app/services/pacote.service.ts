import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Pacote } from '../model/pacote.model';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PacoteService {
  private readonly baseUrl = 'http://localhost:8080/api/pacotes';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  listarPorUsuario(idUsuario: number): Observable<Pacote[]> {
    return this.http.get<Pacote[]>(`${this.baseUrl}/usuario/${idUsuario}`, { headers: this.getAuthHeaders() })
    .pipe(catchError(this.tratarRespostaErro));
  }

  buscarPorId(id: number): Observable<Pacote> {
    return this.http.get<Pacote>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() })
    .pipe(catchError(this.tratarRespostaErro));
  }

  salvar(pacote: Pacote): Observable<Pacote> {
    return this.http.post<Pacote>(this.baseUrl, pacote, { headers: this.getAuthHeaders() })
    .pipe(catchError(this.tratarRespostaErro));
  }

  atualizar(id: number, pacote: Pacote): Observable<Pacote> {
    return this.http.put<Pacote>(`${this.baseUrl}/${id}`, pacote, { headers: this.getAuthHeaders() })
    .pipe(catchError(this.tratarRespostaErro));
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() })
    .pipe(catchError(this.tratarRespostaErro));
  }

  private tratarRespostaErro(erro: any): Observable<never> {
  const msg = erro?.error?.message || 'Erro inesperado no servidor.';
  return throwError(() => new Error(msg));
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
