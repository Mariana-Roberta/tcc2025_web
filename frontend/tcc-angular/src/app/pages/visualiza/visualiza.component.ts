import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { NgIf, NgForOf } from '@angular/common';
import { ThreeDViewComponent } from '../three-d-view/three-d-view.component';
import { Caminhao } from '../../model/caminhao.model';
import { Produto } from '../../model/produto.model';

@Component({
  selector: 'app-visualiza',
  standalone: true,
  imports: [
    NavbarComponent,
    NgIf,
    NgForOf,
    ThreeDViewComponent
  ],
  templateUrl: './visualiza.component.html',
  styleUrl: './visualiza.component.css'
})
export class VisualizaComponent {
  passos: string[] = [
    'Escolha o caminhão',
    'Selecione o produto',
    'Arraste para o canvas',
    'Verifique o encaixe',
    'Confirme o carregamento'
  ];
  passoAtual: number = 0;

  caminhaoSelecionado: Caminhao | null = null;
  produtosSelecionados: Produto[] = [];

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;

    if (state) {
      this.caminhaoSelecionado = state['caminhao'];
      this.produtosSelecionados = state['produtos'] ?? [];
    } else {
      console.warn('Nenhum dado recebido via state. Redirecionando...');
      this.router.navigate(['/otimiza']);
    }
  }

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
