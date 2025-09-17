import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Usuario } from '../model/usuario.model';
import { PopupService } from './popup.service';

/**
 * Serviço de autenticação.
 * O Interceptor injeta a baseUrl e o Bearer quando existir.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private readonly popupService: PopupService
  ) {}

  /** Realiza login e persiste token + usuário no localStorage */
  login(credenciais: { email: string; password: string }): Observable<any> {
    return this.http.post<any>('/auth', credenciais).pipe(
      tap(resposta => {
        localStorage.setItem('token', resposta.token);
        localStorage.setItem('usuario', JSON.stringify({
          id: resposta.id,
          email: resposta.email,
          cnpj: resposta.cnpj,
          razaoSocial: resposta.razaoSocial,
          telefone: resposta.telefone,
          perfil: resposta.perfil
        }));
      })
    );
  }

  /** Faz logout limpando o armazenamento */
  logout(): void {
    this.popupService.limpar?.();
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  /** Usuário está logado? */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /** Recupera o token atual */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /** Obtém o usuário persistido */
  getUsuario(): Usuario | null {
    const raw = localStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
  }

  /** Atualiza o usuário persistido */
  setUsuario(usuario: Usuario): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }
}
