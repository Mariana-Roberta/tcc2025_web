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
  tipo: 'sucesso' | 'erro' = 'sucesso';

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
    this.visivel = true;
    setTimeout(() => this.fechar(), 5000);
  }

  fechar(): void {
    this.visivel = false;
  }
}