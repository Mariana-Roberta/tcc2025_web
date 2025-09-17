import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario.model';

/**
 * Usuários — CRUD básico.
 * Se o backend retornar "text/plain", usamos responseType: 'text' as 'json'.
 */
@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private readonly http: HttpClient) {}

  salvar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>('/usuarios', usuario, { responseType: 'text' as 'json' });
  }

  atualizar(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`/usuarios/${id}`, usuario);
  }

  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`/usuarios/${id}`);
  }

  listarTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>('/usuarios');
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`/usuarios/${id}`);
  }
}
