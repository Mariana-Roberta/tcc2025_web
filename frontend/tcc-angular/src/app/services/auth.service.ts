import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuario } from '../model/usuario.model';
import { PopupService } from './popup.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private popupService: PopupService) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('usuario', JSON.stringify({
          id: response.id,
          email: response.email,
          cnpj: response.cnpj,
          razaoSocial: response.razaoSocial,
          telefone: response.telefone,
          perfil: response.perfil
        }));
      }),
      catchError(this.tratarRespostaErro)
    );
  }

  logout(): void {
    this.popupService.limpar();
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsuario(): any {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  setUsuario(usuario: Usuario): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  private tratarRespostaErro(error: HttpErrorResponse): Observable<never> {
    const mensagem = error?.error?.message || 'Falha ao fazer login.';
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
