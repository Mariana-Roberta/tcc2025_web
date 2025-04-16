import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-cadastro-produtos',
  imports: [NavbarComponent, FormsModule, NgForOf],
  templateUrl: './cadastro-produtos.component.html',
  styleUrl: './cadastro-produtos.component.css'
})
export class CadastroProdutosComponent {
  produtos = [
    { nome: 'Produto B', peso: 8, comprimento: 1.2, largura: 0.6, altura: 0.4 },
    { nome: 'Produto C', peso: 12, comprimento: 1.8, largura: 1, altura: 0.6 },
    { nome: 'Produto D', peso: 5, comprimento: 1, largura: 0.5, altura: 0.3 }
  ];

  caminhoes = [
    { nome: 'Volvo FH 540' },
    { nome: 'Scania R450' },
    { nome: 'Mercedes Axor' },
    { nome: 'DAF XF 105' },
    { nome: 'Iveco Hi-Way' }
  ];

  caminhaoSelecionado: string = '';

  excluirProduto(index: number): void {
    this.produtos.splice(index, 1);
  }

  continuar(): void {
    if (!this.caminhaoSelecionado) {
      alert('Por favor, selecione um caminhão.');
      return;
    }

    console.log('Produto:', this.produtos);
    console.log('Caminhão:', this.caminhaoSelecionado);
  }


  importarCSV(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result as string;
      const linhas = text.split('\n');

      // Remove cabeçalho e percorre as linhas restantes
      for (let i = 1; i < linhas.length; i++) {
        const linha = linhas[i].trim();
        if (!linha) continue;

        const [nome, peso, comprimento, largura, altura] = linha.split(',');

        this.produtos.push({
          nome: nome?.trim(),
          peso: Number(peso),
          comprimento: Number(comprimento),
          largura: Number(largura),
          altura: Number(altura)
        });
      }
    };

    reader.readAsText(file);
  }
}
