import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface PacoteOtimizado {
  x: number;
  y: number;
  z: number;
  comprimento: number;
  largura: number;
  altura: number;
  pacoteId: number;
}

@Injectable({
  providedIn: 'root'
})
export class OtimizarService {
  private readonly apiUrl = 'http://localhost:8080/api/otimizacao';

  constructor(private http: HttpClient) {}

  otimizar(caminhaoPacotes: any): Observable<PacoteOtimizado[]> {
    return this.http.post<PacoteOtimizado[]>(this.apiUrl, caminhaoPacotes);
  }
}
