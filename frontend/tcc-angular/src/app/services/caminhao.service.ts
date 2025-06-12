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
      .pipe(catchError(this.tratarRespostaErro));
  }

  listarPorUsuario(idUsuario: number): Observable<Caminhao[]> {
    return this.http.get<Caminhao[]>(`${this.baseUrl}/usuario/${idUsuario}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.tratarRespostaErro));
  }

  buscarPorId(id: number): Observable<Caminhao> {
    return this.http.get<Caminhao>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.tratarRespostaErro));
  }

  salvar(caminhao: Caminhao): Observable<Caminhao> {
    return this.http.post<Caminhao>(this.baseUrl, caminhao, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.tratarRespostaErro));
  }

  atualizar(id: number, caminhao: Caminhao): Observable<Caminhao> {
    return this.http.put<Caminhao>(`${this.baseUrl}/${id}`, caminhao, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.tratarRespostaErro));
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.tratarRespostaErro));
  }

  private tratarRespostaErro(error: HttpErrorResponse): Observable<never> {
    const mensagem = error?.error?.message || 'Erro inesperado ao processar o caminhão.';
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
