import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ScreenBackgroundComponent } from '../../components/screen-background/screen-background.component';
import { NgClass, NgIf, NgForOf } from '@angular/common';

@Component({
  selector: 'app-gerenciar-carregamento',
  standalone: true,
  imports: [
    NavbarComponent,
    ScreenBackgroundComponent,
    NgClass,
    NgIf,
    NgForOf
  ],
  templateUrl: './gerenciar-carregamento.component.html',
  styleUrl: './gerenciar-carregamento.component.css'
})
export class GerenciarCarregamentoComponent implements OnInit {
  carregamentos: any[] = [];
  carregamentosPorPagina = 1;
  paginaAtual = 1;
  caminhaoExpandido: boolean[] = [];
  pedidoExpandido: { [cIndex: number]: { [pIndex: number]: boolean } } = {};

  ngOnInit(): void {
    this.carregarCarregamentos();
  }

  get totalPaginas(): number {
    return Math.ceil(this.carregamentos.length / this.carregamentosPorPagina);
  }

  get carregamentosPaginados(): any[] {
    const inicio = (this.paginaAtual - 1) * this.carregamentosPorPagina;
    return this.carregamentos.slice(inicio, inicio + this.carregamentosPorPagina);
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
    }
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
    }
  }

  irParaPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
    }
  }

  toggleCaminhao(index: number): void {
    this.caminhaoExpandido[index] = !this.caminhaoExpandido[index];
  }

  togglePedido(cIndex: number, pIndex: number): void {
    if (!this.pedidoExpandido[cIndex]) {
      this.pedidoExpandido[cIndex] = {};
    }
    this.pedidoExpandido[cIndex][pIndex] = !this.pedidoExpandido[cIndex][pIndex];
  }

  carregarCarregamentos() {
    this.carregamentos = [
      {
        caminhao: {
          id: 1,
          nome: 'Truck A',
          comprimento: 8,
          largura: 2.5,
          altura: 3,
          pesoLimite: 10000,
          usuario: { id: 1 }
        },
        pedidos: [
          {
            id: 1,
            descricao: 'Pedido Eletrônicos',
            pacotes: [
              {
                id: 101,
                nome: 'TV 55"',
                comprimento: 1.2,
                largura: 0.3,
                altura: 0.8,
                peso: 25,
                fragil: true,
                quantidade: 2
              },
              {
                id: 102,
                nome: 'Caixa de Som',
                comprimento: 0.6,
                largura: 0.6,
                altura: 0.6,
                peso: 10,
                fragil: true,
                quantidade: 3
              }
            ]
          },
          {
            id: 2,
            descricao: 'Pedido Roupas',
            pacotes: [
              {
                id: 103,
                nome: 'Caixa de Roupas',
                comprimento: 0.7,
                largura: 0.7,
                altura: 0.7,
                peso: 8,
                fragil: false,
                quantidade: 5
              }
            ]
          }
        ]
      },
      {
        caminhao: {
          id: 2,
          nome: 'Truck B',
          comprimento: 10,
          largura: 2.8,
          altura: 3.5,
          pesoLimite: 12000,
          usuario: { id: 2 }
        },
        pedidos: [
          {
            id: 1,
            descricao: 'Pedido Construção',
            pacotes: [
              {
                id: 201,
                nome: 'Saco de Cimento',
                comprimento: 0.5,
                largura: 0.4,
                altura: 0.15,
                peso: 50,
                fragil: false,
                quantidade: 20
              },
              {
                id: 202,
                nome: 'Tinta 20L',
                comprimento: 0.3,
                largura: 0.3,
                altura: 0.4,
                peso: 25,
                fragil: true,
                quantidade: 5
              }
            ]
          }
        ]
      },
      {
        caminhao: {
          id: 3,
          nome: 'Truck C',
          comprimento: 6,
          largura: 2.3,
          altura: 2.8,
          pesoLimite: 8000,
          usuario: { id: 3 }
        },
        pedidos: [
          {
            id: 1,
            descricao: 'Pedido Livros',
            pacotes: [
              {
                id: 301,
                nome: 'Caixa de Livros',
                comprimento: 0.6,
                largura: 0.4,
                altura: 0.4,
                peso: 15,
                fragil: false,
                quantidade: 6
              }
            ]
          },
          {
            id: 2,
            descricao: 'Pedido Papéis',
            pacotes: [
              {
                id: 302,
                nome: 'Papel A4',
                comprimento: 0.3,
                largura: 0.2,
                altura: 0.25,
                peso: 5,
                fragil: false,
                quantidade: 10
              }
            ]
          },
          {
            id: 3,
            descricao: 'Pedido Canecas Personalizadas',
            pacotes: [
              {
                id: 303,
                nome: 'Caixa de Canecas',
                comprimento: 0.5,
                largura: 0.5,
                altura: 0.3,
                peso: 7,
                fragil: true,
                quantidade: 4
              }
            ]
          }
        ]
      }
    ];
    this.caminhaoExpandido = this.carregamentos.map(() => false);
    this.pedidoExpandido = {};
  }
}
