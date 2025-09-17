import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface PacoteOtimizado {
  x: number; y: number; z: number;
  comprimento: number; largura: number; altura: number;
  pacoteId: number; pedidoId?: number;
}

@Injectable({ providedIn: 'root' })
export class OtimizarService {
  constructor(private readonly http: HttpClient) {}

  otimizar(body: any): Observable<PacoteOtimizado[]> {
    return this.http.post<PacoteOtimizado[]>(`/otimizacao`, body);
  }

  criarCarregamento(body: any) {
    return this.http.post<any>(`/carregamentos`, body);
  }

  obterCarregamento(id: number) {
    return this.http.get<any>(`/carregamentos/${id}`);
  }
}
