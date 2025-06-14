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
      catchError(this.handleError)
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

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Falha ao fazer login.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro do cliente: ${error.error.message}`;
    } else {
      if (error.error && typeof error.error === 'object' && error.error.message) {
        errorMessage = error.error.message;
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.status === 403) {
        errorMessage = 'Acesso negado. Verifique suas credenciais.';
      } else if (error.status === 0) {
        errorMessage = 'Servidor indisponível ou erro de conexão.';
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
