import { Component } from '@angular/core';
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {NgForOf, NgIf} from "@angular/common";
import {Caminhao} from '../../model/caminhao.model';
import {Produto} from '../../model/produto.model';
import {Router} from '@angular/router';
import {ScreenBackgroundComponent} from '../../components/screen-background/screen-background.component';

@Component({
  selector: 'app-otimiza',
  imports: [
    NavbarComponent,
    NgForOf,
    NgIf,
    ScreenBackgroundComponent
  ],
  templateUrl: './otimiza.component.html',
  styleUrl: './otimiza.component.css'
})
export class OtimizaComponent {
  caminhoes: Caminhao[] = [];
  caminhaoSelecionado: Caminhao | null = null;

  produtos: Produto[] = [];
  produtosSelecionados: Produto[] = [];

  constructor(private _router: Router) {
  }

  ngOnInit() {
    this.caminhoes = [
      {
        modelo: 'Volvo FH 540',
        placa: 'ABC1234',
        comprimento: 12.5,
        largura: 2.5,
        altura: 3.9,
        pesoLimite: 28000 // em kg
      },
      {
        modelo: 'Scania R',
        placa: 'XYZ5678',
        comprimento: 13.0,
        largura: 2.55,
        altura: 4.0,
        pesoLimite: 30000 // em kg
      },
      {
        modelo: 'Scania R2',
        placa: 'XYZ56D8',
        comprimento: 13.0,
        largura: 2.55,
        altura: 4.0,
        pesoLimite: 30000 // em kg
      },
      {
        modelo: 'Scania R3',
        placa: 'XYZ5478',
        comprimento: 13.0,
        largura: 2.55,
        altura: 4.0,
        pesoLimite: 30000 // em kg
      }
    ];

    this.produtos = [
      {
        nome: 'Caixa A',
        comprimento: 1.0,
        largura: 1.0,
        altura: 1.0,
        peso: 250 // em kg
      },
      {
        nome: 'Caixa B',
        comprimento: 1.2,
        largura: 0.8,
        altura: 0.8,
        peso: 180
      },
      {
        nome: 'Caixa C',
        comprimento: 0.9,
        largura: 0.6,
        altura: 0.6,
        peso: 120
      },
      {
        nome: 'Caixa D',
        comprimento: 0.9,
        largura: 0.6,
        altura: 0.6,
        peso: 120
      },
      {
        nome: 'Caixa E',
        comprimento: 0.9,
        largura: 0.6,
        altura: 0.6,
        peso: 120
      },
      {
        nome: 'Caixa F',
        comprimento: 0.9,
        largura: 0.6,
        altura: 0.6,
        peso: 120
      },
      {
        nome: 'Caixa G',
        comprimento: 0.9,
        largura: 0.6,
        altura: 0.6,
        peso: 120
      }
    ];
  }
  selecionarCaminhao(c: any) {
    this.caminhaoSelecionado = c;
    this.produtosSelecionados = [];
  }

  toggleProduto(p: any) {
    if (this.produtosSelecionados.includes(p)) {
      this.produtosSelecionados = this.produtosSelecionados.filter(item => item !== p);
    } else {
      this.produtosSelecionados.push(p);
    }
  }

  irParaVisualizacao() {
    // Ex: navegar com router para a próxima rota
    this._router.navigate(['/visualiza'], {
      state: {
        caminhao: this.caminhaoSelecionado,
        produtos: this.produtosSelecionados
      }
    });
  }
}
