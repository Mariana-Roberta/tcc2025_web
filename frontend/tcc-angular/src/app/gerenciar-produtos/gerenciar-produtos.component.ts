import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NavbarComponent} from '../components/navbar/navbar.component';
import {ScreenBackgroundComponent} from '../components/screen-background/screen-background.component';

interface Caminhao {
  modelo: string;
  placa: string;
  ano: number;
}

interface Produto {
  nome: string;
  codigo: string;
  caminhaoPlaca: string;
}

@Component({
  selector: 'app-gerenciar-produtos',
  templateUrl: './gerenciar-produtos.component.html',
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    NavbarComponent,
    ScreenBackgroundComponent
  ],
  styleUrls: ['./gerenciar-produtos.component.css']
})
export class GerenciarProdutosComponent {
  caminhoes: Caminhao[] = [
    { modelo: 'Volvo FH', placa: 'ABC1D23', ano: 2020 },
    { modelo: 'Scania R', placa: 'XYZ4F56', ano: 2018 }
  ];

  produtos: Produto[] = [];

  novoProduto: Partial<Produto> = {
    nome: '',
    codigo: '',
    caminhaoPlaca: ''
  };

  mostrarFormulario = false;
  modoEdicao = false;
  indiceEdicao: number | null = null;

  exibirFormulario() {
    this.novoProduto = { nome: '', codigo: '', caminhaoPlaca: '' };
    this.mostrarFormulario = true;
    this.modoEdicao = false;
    this.indiceEdicao = null;
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.novoProduto = { nome: '', codigo: '', caminhaoPlaca: '' };
    this.modoEdicao = false;
    this.indiceEdicao = null;
  }

  adicionarOuEditarProduto() {
    if (
      this.novoProduto.nome?.trim() &&
      this.novoProduto.codigo?.trim() &&
      this.novoProduto.caminhaoPlaca?.trim()
    ) {
      const novo: Produto = {
        nome: this.novoProduto.nome,
        codigo: this.novoProduto.codigo,
        caminhaoPlaca: this.novoProduto.caminhaoPlaca
      };

      if (this.modoEdicao && this.indiceEdicao !== null) {
        this.produtos[this.indiceEdicao] = novo;
      } else {
        this.produtos.push(novo);
      }

      this.cancelar();
    }
  }

  editarProduto(produto: Produto, index: number) {
    this.novoProduto = { ...produto };
    this.mostrarFormulario = true;
    this.modoEdicao = true;
    this.indiceEdicao = index;
  }

  excluirProduto(produto: Produto) {
    this.produtos = this.produtos.filter(p => p !== produto);
  }
}
