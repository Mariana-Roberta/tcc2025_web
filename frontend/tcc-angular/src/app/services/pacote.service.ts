import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pacote } from '../model/pacote.model';

/**
 * Pacotes — CRUD e listagem por usuário.
 */
@Injectable({ providedIn: 'root' })
export class PacoteService {
  constructor(private readonly http: HttpClient) {}

  listarPorUsuario(idUsuario: number): Observable<Pacote[]> {
    return this.http.get<Pacote[]>(`/pacotes/usuario/${idUsuario}`);
  }

  listarTodos(): Observable<Pacote[]> {
    return this.http.get<Pacote[]>('/pacotes');
  }

  buscarPorId(id: number): Observable<Pacote> {
    return this.http.get<Pacote>(`/pacotes/${id}`);
  }

  salvar(pacote: Pacote): Observable<Pacote> {
    return this.http.post<Pacote>('/pacotes', pacote);
  }

  atualizar(id: number, pacote: Pacote): Observable<Pacote> {
    return this.http.put<Pacote>(`/pacotes/${id}`, pacote);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`/pacotes/${id}`);
  }
}
