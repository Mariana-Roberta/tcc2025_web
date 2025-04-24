import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<Pacote[]>(`${this.baseUrl}/usuario/${idUsuario}`, { headers: this.getAuthHeaders() });
  }

  buscarPorId(id: number): Observable<Pacote> {
    return this.http.get<Pacote>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  salvar(pacote: Pacote): Observable<Pacote> {
    return this.http.post<Pacote>(this.baseUrl, pacote, { headers: this.getAuthHeaders() });
  }

  atualizar(id: number, pacote: Pacote): Observable<Pacote> {
    return this.http.put<Pacote>(`${this.baseUrl}/${id}`, pacote, { headers: this.getAuthHeaders() });
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
