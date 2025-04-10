import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Pessoa} from '../model/pessoa.model';
import {Observable, switchMap} from 'rxjs';
import {Usuario} from '../model/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = 'http://localhost:8080/api'; // Ajuste conforme necessário

  constructor(private http: HttpClient) {}

  // 1. Salva a Pessoa
  cadastrarPessoa(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.post<Pessoa>(`${this.baseUrl}/pessoas`, pessoa);
  }

  // 2. Salva o Usuario (depois de obter o idPessoa)
  cadastrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/usuarios`, usuario);
  }

}
