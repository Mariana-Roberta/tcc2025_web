import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
    return this.http.post<Usuario>(this.apiUrl, usuario).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    // Aqui você pode customizar a mensagem de erro
    if (error.status === 0) {
      console.error('Erro de rede ou servidor fora do ar:', error.error);
    } else {
      console.error(`Erro do backend (${error.status}):`, error.error);
    }
    return throwError(() => new Error('Erro ao processar a requisição. Tente novamente mais tarde.'));
  }

}
