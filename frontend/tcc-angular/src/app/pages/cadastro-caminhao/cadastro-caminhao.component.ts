import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import {NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-cadastro-caminhao',
  imports: [NavbarComponent, NgForOf, FormsModule],
  templateUrl: './cadastro-caminhao.component.html',
  styleUrl: './cadastro-caminhao.component.css'
})
export class CadastroCaminhaoComponent {
  caminhoes = [
    { nome: 'Volvo FH 540', pesoLimite: 1000, comprimento: 12.5, altura: 3.9, largura: 2.5 },
    { nome: 'Scania R450', pesoLimite: 1000, comprimento: 13, altura: 4, largura: 2.6 },
    { nome: 'Mercedes Axor', pesoLimite: 1000, comprimento: 11.8, altura: 3.8, largura: 2.5 },
    { nome: 'DAF XF 105', pesoLimite: 1000, comprimento: 12.2, altura: 4.1, largura: 2.55 },
    { nome: 'Iveco Hi-Way', pesoLimite: 1000, comprimento: 13.5, altura: 4, largura: 2.6 },
  ];

  excluirCaminhao(index: number): void {
    this.caminhoes.splice(index, 1);
  }

  selectedCaminhao: any = null;

  continuarParaProdutos() {
    if (this.selectedCaminhao) {
      console.log('Caminhão selecionado:', this.selectedCaminhao);

    } else {
      alert('Por favor, selecione um caminhão antes de continuar.');
    }
  }

  filtro: string = '';


}
