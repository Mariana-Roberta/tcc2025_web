import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-popup',
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent implements OnInit {
  visivel = false;
  mensagem: string = '';
  tipo: 'sucesso' | 'erro' | 'alerta' = 'sucesso';
  progresso = 100;

  private timeoutId: any = null;

  constructor(private popupService: PopupService) {}

  ngOnInit(): void {
    this.popupService.mensagem$.subscribe(msg => {
      if (msg) {
        this.mensagem = msg.mensagem;
        this.tipo = msg.tipo;
        this.exibir();
      }
    });
  }

  exibir(): void {
    // Fecha popup anterior se ainda estiver ativo
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.visivel = true;
    this.progresso = 100;

    // Reinicia animação da barra
    setTimeout(() => {
      const barra = document.querySelector('.barra-progresso') as HTMLElement;
      if (barra) {
        barra.classList.remove('animar');  // remove animação anterior
        void barra.offsetWidth;            // força reflow
        barra.classList.add('animar');     // reaplica animação
      }
    }, 0);

    // Novo timeout
    this.timeoutId = setTimeout(() => {
      this.fechar();
    }, 5000);
  }

  fechar(): void {
    this.visivel = false;
    this.progresso = 0;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
