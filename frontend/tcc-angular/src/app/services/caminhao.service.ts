import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  // Buscar todos os caminhões (se usado)
  listarTodos(): Observable<Caminhao[]> {
    return this.http.get<Caminhao[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  // Buscar caminhões por ID do usuário
  listarPorUsuario(idUsuario: number): Observable<Caminhao[]> {
    return this.http.get<Caminhao[]>(`${this.baseUrl}/usuario/${idUsuario}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Buscar caminhão por ID
  buscarPorId(id: number): Observable<Caminhao> {
    return this.http.get<Caminhao>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Criar novo caminhão
  salvar(caminhao: Caminhao): Observable<Caminhao> {
    return this.http.post<Caminhao>(this.baseUrl, caminhao, { headers: this.getAuthHeaders() });
  }

  // Atualizar caminhão existente
  atualizar(id: number, caminhao: Caminhao): Observable<Caminhao> {
    return this.http.put<Caminhao>(`${this.baseUrl}/${id}`, caminhao, { headers: this.getAuthHeaders() });
  }

  // Excluir caminhão
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
