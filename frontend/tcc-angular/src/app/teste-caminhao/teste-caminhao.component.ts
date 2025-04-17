import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import {NavbarComponent} from '../components/navbar/navbar.component';
import {ScreenBackgroundComponent} from '../components/screen-background/screen-background.component';

// Definindo uma interface para melhor tipagem
interface Caminhao {
  modelo: string;
  placa: string;
  ano: number;
}

@Component({
  selector: 'app-teste-caminhao',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf, NavbarComponent, ScreenBackgroundComponent],
  templateUrl: './teste-caminhao.component.html',
  styleUrl: './teste-caminhao.component.css'
})
export class TesteCaminhaoComponent {
  caminhoes = [
    { modelo: 'Volvo FH', placa: 'ABC1D23', ano: 2020 },
    { modelo: 'Scania R', placa: 'XYZ4F56', ano: 2018 },
    { modelo: 'Mercedes-Benz Actros', placa: 'DEF7G89', ano: 2022 },
    { modelo: 'Daf XF', placa: 'GHJ0J12', ano: 2019 }
  ];

  mostrarFormulario = false;
  modoEdicao = false;
  indiceEdicao: number | null = null;

  novoCaminhao: { modelo: string; placa: string; ano: number | null } = {
    modelo: '',
    placa: '',
    ano: null
  };

  exibirFormulario() {
    this.mostrarFormulario = true;
    this.modoEdicao = false;
    this.novoCaminhao = { modelo: '', placa: '', ano: null };
  }

  editarCaminhao(caminhao: any, index: number) {
    console.log("apertou pra editar")
    this.mostrarFormulario = true;
    this.modoEdicao = true;
    this.indiceEdicao = index;
    this.novoCaminhao = { ...caminhao };
  }

  cancelarAdicao() {
    this.mostrarFormulario = false;
    this.novoCaminhao = { modelo: '', placa: '', ano: null };
    this.modoEdicao = false;
    this.indiceEdicao = null;
  }

  adicionarOuEditarCaminhao() {
    if (this.novoCaminhao.modelo && this.novoCaminhao.placa && this.novoCaminhao.ano !== null) {
      if (this.modoEdicao && this.indiceEdicao !== null) {
        // Edição
        this.caminhoes[this.indiceEdicao] = {
          modelo: this.novoCaminhao.modelo,
          placa: this.novoCaminhao.placa,
          ano: this.novoCaminhao.ano as number
        };

      } else {
        // Adição
        this.caminhoes.push({
          modelo: this.novoCaminhao.modelo!,
          placa: this.novoCaminhao.placa!,
          ano: this.novoCaminhao.ano as number
        });

      }

      this.cancelarAdicao();
    }
  }

  excluirCaminhao(caminhao: any) {
    this.caminhoes = this.caminhoes.filter(c => c !== caminhao);
  }

  // Número de itens por página
  itensPorPagina = 5;

// Página atual (começa na 1)
  paginaAtual = 1;

// Caminhões filtrados por página
  get caminhoesPaginados() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.caminhoes.slice(inicio, fim);
  }

// Total de páginas
  get totalPaginas() {
    return Math.ceil(this.caminhoes.length / this.itensPorPagina);
  }

// Mudar de página
  mudarPagina(pagina: number) {
    this.paginaAtual = pagina;
  }

}
