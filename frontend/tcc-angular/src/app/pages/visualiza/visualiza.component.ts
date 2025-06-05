import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { NgIf, NgForOf } from '@angular/common';
import { ThreeDViewComponent } from '../three-d-view/three-d-view.component';
import { OtimizarService } from '../../services/otimizar.service';

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
  caminhao: any;
  pedidos: any[] = [];
  pacotes: any[] = [];
  pacotesRecebidos: any[] = [];

  pedidoIds: number[] = [];
  pedidoAtualId: number = 0;
  pacoteAtualId: number = 0;

  indicePedidoAtual = 0;
  indicePacoteAtualPorPedido: { [pedidoId: number]: number } = {};

  loading = true;

  constructor(private router: Router, private otimizarService: OtimizarService) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { dados: any };

    if (state?.dados) {
      this.caminhao = state.dados.caminhao;
      this.pedidos = state.dados.pedidos;

      this.enviarParaOtimizar(this.caminhao, this.pedidos);
    }
  }

  enviarParaOtimizar(caminhao: any, pedidos: any[]): void {
    const body = {
      caminhao: {
        id: caminhao.id,
        nome: caminhao.nome,
        comprimento: caminhao.comprimento,
        largura: caminhao.largura,
        altura: caminhao.altura,
        pesoLimite: caminhao.pesoLimite,
        usuario: {
          id: caminhao.usuario?.id ?? 1
        }
      },
      pedidos: pedidos.map((pedido, idx) => ({
        id: pedido.id ?? idx + 1,
        descricao: pedido.descricao ?? pedido.nome ?? `Pedido #${idx + 1}`,
        pacotes: pedido.pacotes.map((p: any) => ({
          id: p.id,
          nome: p.nome,
          comprimento: p.comprimento,
          largura: p.largura,
          altura: p.altura,
          peso: p.peso,
          fragil: p.fragil,
          quantidade: p.quantidade
        }))
      }))
    };

    console.log("ENVIANDO PARA BACKEND:", body);

    this.otimizarService.otimizar(body).subscribe({
      next: (dados) => {
        this.pacotes = dados.map((d: any) => ({
          x: d.x,
          y: d.y,
          z: d.z,
          comprimento: d.comprimento,
          largura: d.largura,
          altura: d.altura,
          pacoteId: d.pacoteId,
          pedidoId: d.idPedido
        }));
        console.table(dados);

        console.log("DADOS1: ",this.pacotes);
        this.pedidoIds = [...new Set(this.pacotes.map(p => p.pedidoId))].sort((a, b) => a - b);
        this.pedidoAtualId = this.pedidoIds[0];

        const pacotesDoPedido = this.pacotes.filter(p => p.pedidoId === this.pedidoAtualId);
        const primeirosIds = [...new Set(pacotesDoPedido.map(p => p.pacoteId))].sort((a, b) => a - b);

        this.pacoteAtualId = primeirosIds[0];

        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao otimizar pacotes:', err);
        this.loading = false;
      }
    });
  }

  get pedidoAtual() {
  return this.pedidos.find(p => p.id === this.pedidoAtualId);
}


  get pacoteIdAtual() {
  const pedido = this.pedidoAtual;
  const ids = [...new Set<number>(pedido.pacotes.map((p: any) => p.id))].sort((a, b) => a - b);
  const index = this.indicePacoteAtualPorPedido[pedido.id] ?? 0;
  return ids[index];
}


get pacotesParaMostrar() {
  return this.pacotes.filter(p => p.pedidoId === this.pedidoAtualId);
}



get pacotesIdsDoPedidoAtual(): number[] {
  const pacotesPedidoAtual = this.pacotes.filter(p => p.pedidoId === this.pedidoAtualId);
  return [...new Set<number>(pacotesPedidoAtual.map(p => p.cor))].sort((a, b) => a - b);
}

avancarPasso(): void {
  const nextPedidoIndex = this.pedidoIds.indexOf(this.pedidoAtualId) + 1;
  if (nextPedidoIndex < this.pedidoIds.length) {
    this.pedidoAtualId = this.pedidoIds[nextPedidoIndex];
  }
}

voltarPasso(): void {
  const prevPedidoIndex = this.pedidoIds.indexOf(this.pedidoAtualId) - 1;
  if (prevPedidoIndex >= 0) {
    this.pedidoAtualId = this.pedidoIds[prevPedidoIndex];
  }
}

confirmar(): void {
    alert('Todos os pacotes carregados e confirmados!');
  }
}
