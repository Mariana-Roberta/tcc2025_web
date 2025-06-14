import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ThreeDViewComponent } from '../three-d-view/three-d-view.component';
import { PopupComponent } from '../../components/popup/popup.component';

import { OtimizarService } from '../../services/otimizar.service';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-visualiza',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    ThreeDViewComponent,
    PopupComponent
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

  coresPacotes: Map<string, string> = new Map();

  loading = true;

  constructor(
    private router: Router,
    private otimizarService: OtimizarService,
    private popupService: PopupService
  ) {
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
          rotacao: p.rotacao,
          fragil: p.fragil,
          quantidade: p.quantidade
        }))
      }))
    };

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

        this.pedidoIds = [...new Set(this.pacotes.map(p => p.pedidoId))].sort((a, b) => a - b);
        this.pedidoAtualId = this.pedidoIds.length > 0 ? this.pedidoIds[0] : -1;

        const pacotesDoPedido = this.pacotes.filter(p => p.pedidoId === this.pedidoAtualId);
        const primeirosIds = [...new Set(pacotesDoPedido.map(p => p.pacoteId))].sort((a, b) => a - b);

        this.pacoteAtualId = primeirosIds[0];

        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao otimizar pacotes:', err);
        this.popupService.erro(err.message);
        this.loading = false;
      }
    });
  }

  get pedidoAtual() {
    return this.pedidos.find(p => p.id === this.pedidoAtualId) ?? null;
  }

  get resumoPacotesDoPedidoAtual() {
    const pacotesPedido = this.pedidoAtual?.pacotes || [];
    const agrupados: { [id: number]: { nome: string, quantidade: number } } = {};

    for (const p of pacotesPedido) {
      const id = p.id;
      const nome = p.nome || `Pacote #${id}`;
      if (!agrupados[id]) agrupados[id] = { nome, quantidade: 0 };
      agrupados[id].quantidade += p.quantidade || 1;
    }

    return Object.entries(agrupados).map(([id, { nome, quantidade }]) => ({
      id: +id,
      nome,
      quantidade
    }));
  }

  get pacoteIdAtual() {
    const pedido = this.pedidoAtual;
    const ids = [...new Set<number>(pedido.pacotes.map((p: any) => p.id))].sort((a, b) => a - b);
    const index = this.indicePacoteAtualPorPedido[pedido.id] ?? 0;
    return ids[index];
  }

  get pacotesParaMostrar() {
    const indexAtual = this.pedidoIds.indexOf(this.pedidoAtualId);
    const pedidosAteAtual = this.pedidoIds.slice(0, indexAtual + 1);
    return this.pacotes.filter(p => pedidosAteAtual.includes(p.pedidoId));
  }

  get pacotesIdsDoPedidoAtual(): number[] {
    const pacotesPedidoAtual = this.pacotes.filter(p => p.pedidoId === this.pedidoAtualId);
    return [...new Set<number>(pacotesPedidoAtual.map(p => p.cor))].sort((a, b) => a - b);
  }

  avancarPasso(): void {
    const indexAtual = this.pedidoIds.indexOf(this.pedidoAtualId);
    const proximoIndex = indexAtual + 1;

    if (proximoIndex < this.pedidoIds.length) {
      this.pedidoAtualId = this.pedidoIds[proximoIndex];

      const pacotesDoNovoPedido = this.pacotes.filter(p => p.pedidoId === this.pedidoAtualId);
      const idsUnicos = [...new Set<number>(pacotesDoNovoPedido.map(p => p.pacoteId))].sort((a, b) => a - b);
      this.indicePacoteAtualPorPedido[this.pedidoAtualId] ??= 0;
      this.pacoteAtualId = idsUnicos[this.indicePacoteAtualPorPedido[this.pedidoAtualId] || 0];
    }

  }

  voltarPasso(): void {
    const indexAtual = this.pedidoIds.indexOf(this.pedidoAtualId);
    const anteriorIndex = indexAtual - 1;

    if (anteriorIndex >= 0) {
      this.pedidoAtualId = this.pedidoIds[anteriorIndex];

      const pacotesDoNovoPedido = this.pacotes.filter(p => p.pedidoId === this.pedidoAtualId);
      const idsUnicos = [...new Set<number>(pacotesDoNovoPedido.map(p => p.pacoteId))].sort((a, b) => a - b);
      this.indicePacoteAtualPorPedido[this.pedidoAtualId] ??= 0;
      this.pacoteAtualId = idsUnicos[this.indicePacoteAtualPorPedido[this.pedidoAtualId] || 0];
    }

  }

  confirmar(): void {
    this.popupService.sucesso('Todos os pacotes carregados e confirmados!');
  }

  receberCoresGeradas(cores: Map<string, string>) {
    this.coresPacotes = cores;
  }
}
