import { Component } from '@angular/core';
import {NavbarComponent} from '../../components/navbar/navbar.component';
import {NgIf} from '@angular/common';
import {ThreeDViewComponent} from '../three-d-view/three-d-view.component';

@Component({
  selector: 'app-realiza-otimizacao',
  imports: [NavbarComponent, NgIf, ThreeDViewComponent],
  templateUrl: './realiza-otimizacao.component.html',
  styleUrl: './realiza-otimizacao.component.css'
})
export class RealizaOtimizacaoComponent {
  passos: string[] = [
    'Escolha o caminhão',
    'Selecione o produto',
    'Arraste para o canvas',
    'Verifique o encaixe',
    'Confirme o carregamento'
  ];

  passoAtual: number = 0;

  avancarPasso() {
    if (this.passoAtual < this.passos.length - 1) {
      this.passoAtual++;
    }
  }

  voltarPasso() {
    if (this.passoAtual > 0) {
      this.passoAtual--;
    }
  }

  confirmar() {
    alert('Carregamento confirmado!');
  }

}
