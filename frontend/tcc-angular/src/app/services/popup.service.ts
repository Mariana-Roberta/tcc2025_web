import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * Serviço simples para notificação visual (sucesso/erro/aviso).
 * Pode estar integrado ao seu componente <app-popup>.
 */
export class PopupService {
  private readonly mensagemSubject = new BehaviorSubject<{ mensagem: string, tipo: 'sucesso' | 'erro' } | null>(null);
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
