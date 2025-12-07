import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Caminhao } from '../model/caminhao.model';

/**
 * Caminhões — CRUD e listagem por usuário.
 */
@Injectable({ providedIn: 'root' })
export class CaminhaoService {
  constructor(private readonly http: HttpClient) {}

  listarPorUsuario(idUsuario: number): Observable<Caminhao[]> {
    return this.http.get<Caminhao[]>(`/caminhoes/usuario/${idUsuario}`);
  }

  listarTodos(): Observable<Caminhao[]> {
    return this.http.get<Caminhao[]>('/caminhoes');
  }

  buscarPorId(id: number): Observable<Caminhao> {
    return this.http.get<Caminhao>(`/caminhoes/${id}`);
  }

  salvar(caminhao: Caminhao): Observable<Caminhao> {
    return this.http.post<Caminhao>('/caminhoes', caminhao);
  }

  atualizar(id: number, caminhao: Caminhao): Observable<Caminhao> {
    return this.http.put<Caminhao>(`/caminhoes/${id}`, caminhao);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`/caminhoes/${id}`);
  }
}
