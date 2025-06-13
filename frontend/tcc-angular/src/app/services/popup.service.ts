import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private mensagemSubject = new BehaviorSubject<{ mensagem: string, tipo: 'sucesso' | 'erro' } | null>(null);
  mensagem$ = this.mensagemSubject.asObservable();

  sucesso(mensagem: string) {
    this.mensagemSubject.next({ mensagem, tipo: 'sucesso' });
  }

  erro(mensagem: string) {
    this.mensagemSubject.next({ mensagem, tipo: 'erro' });
  }

  limpar() {
    this.mensagemSubject.next(null); // limpa qualquer mensagem ativa
  }
}
