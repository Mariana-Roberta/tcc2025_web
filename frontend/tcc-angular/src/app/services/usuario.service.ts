import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuario } from '../model/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  cadastrarUsuario(usuario: Usuario): Observable<Usuario> {

    return this.http.post<Usuario>(this.apiUrl, usuario, { responseType: 'text' as 'json' }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro inesperado no servidor.';

    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente (ex: erro de rede)
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
