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
  pacotes: any[] = []; // saída da API de otimização
  coresPacotes: Map<string, string> = new Map();

  pedidoIds: number[] = [];
  pedidoAtualId = 0;
  pacoteAtualId = 0;

  indicePacoteAtualPorPedido: { [pedidoId: number]: number } = {};
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
      this.pedidos = state.dados.pedidos || [];
      this.enviarParaOtimizar(this.caminhao, this.pedidos);
    } else {
      this.loading = false;
      this.popupService.erro('Nenhum dado de otimização encontrado.');
    }
  }

  /** Chama o endpoint de otimização e prepara a visualização */
  enviarParaOtimizar(caminhao: any, pedidos: any[]): void {
    const body = {
      caminhao: {
        id: +caminhao.id,
        nome: caminhao.nome,
        comprimento: +caminhao.comprimento,
        largura: +caminhao.largura,
        altura: +caminhao.altura,
        pesoLimite: +caminhao.pesoLimite,
        usuario: { id: caminhao?.usuario?.id ?? 1 }
      },
      pedidos: pedidos.map((pedido, idx) => ({
        id: +(pedido.id ?? idx + 1),
        descricao: pedido.descricao ?? pedido.nome ?? `Pedido #${idx + 1}`,
        pacotes: (pedido.pacotes || []).map((p: any) => ({
          id: +p.id,
          nome: p.nome ?? null,
          comprimento: +p.comprimento,
          largura: +p.largura,
          altura: +p.altura,
          peso: +p.peso,
          rotacao: !!p.rotacao,
          fragil: !!p.fragil,
          quantidade: +p.quantidade || 1
        }))
      }))
    };

    this.loading = true;
    this.otimizarService.otimizar(body).subscribe({
      next: (dados) => {
        // normaliza saída para o 3D
        this.pacotes = (dados || []).map((d: any) => ({
          x: +d.x,
          y: +d.y,
          z: +d.z,
          comprimento: +d.comprimento,
          largura: +d.largura,
          altura: +d.altura,
          pacoteId: +d.pacoteId,
          pedidoId: +d.idPedido
        }));

        this.pedidoIds = [...new Set(this.pacotes.map(p => p.pedidoId))].sort((a, b) => a - b);
        this.pedidoAtualId = this.pedidoIds.length > 0 ? this.pedidoIds[0] : -1;

        const pacotesDoPedido = this.pacotes.filter(p => p.pedidoId === this.pedidoAtualId);
        const primeirosIds = [...new Set(pacotesDoPedido.map(p => p.pacoteId))].sort((a, b) => a - b);
        this.pacoteAtualId = primeirosIds[0] ?? 0;

        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao otimizar pacotes:', err);
        this.popupService.erro(err?.error?.mensagem || err.message || 'Erro ao otimizar.');
        this.loading = false;
      }
    });
  }

  /** Pedido atualmente selecionado (do array "pedidos" que veio do step anterior) */
  get pedidoAtual() {
    return this.pedidos.find(p => +p.id === +this.pedidoAtualId) ?? null;
  }

  /** Resumo (id, nome, quantidade) dos pacotes do pedido atual */
  get resumoPacotesDoPedidoAtual() {
    const pacotesPedido = this.pedidoAtual?.pacotes || [];
    const agrupados: { [id: number]: { nome: string, quantidade: number } } = {};

    for (const p of pacotesPedido) {
      const id = +p.id;
      const nome = p.nome || `Pacote #${id}`;
      if (!agrupados[id]) agrupados[id] = { nome, quantidade: 0 };
      agrupados[id].quantidade += +p.quantidade || 1;
    }

    return Object.entries(agrupados).map(([id, { nome, quantidade }]) => ({
      id: +id,
      nome,
      quantidade
    }));
  }

  /** Pacote ID atual (seleção dentro do pedido atual) */
  get pacoteIdAtual() {
    const pedido = this.pedidoAtual;
    if (!pedido || !Array.isArray(pedido.pacotes) || pedido.pacotes.length === 0) return null;

    const ids = [...new Set<number>(pedido.pacotes.map((p: any) => +p.id))].sort((a, b) => a - b);
    const index = this.indicePacoteAtualPorPedido[pedido.id] ?? 0;
    return ids[index] ?? null;
  }

  /** Pacotes para desenhar até o pedido atual (efeito “passo a passo”) */
  get pacotesParaMostrar() {
    const indexAtual = this.pedidoIds.indexOf(this.pedidoAtualId);
    const pedidosAteAtual = this.pedidoIds.slice(0, indexAtual + 1);
    return this.pacotes.filter(p => pedidosAteAtual.includes(p.pedidoId));
  }

  /** IDs de pacotes do pedido atual (a partir do resultado da otimização) */
  get pacotesIdsDoPedidoAtual(): number[] {
    const pacotesPedidoAtual = this.pacotes.filter(p => p.pedidoId === this.pedidoAtualId);
    return [...new Set<number>(pacotesPedidoAtual.map(p => +p.pacoteId))].sort((a, b) => a - b);
  }

  /** Navegação para frente entre pedidos */
  avancarPasso(): void {
    const indexAtual = this.pedidoIds.indexOf(this.pedidoAtualId);
    const proximoIndex = indexAtual + 1;

    if (proximoIndex < this.pedidoIds.length) {
      this.pedidoAtualId = this.pedidoIds[proximoIndex];

      const pacotesDoNovoPedido = this.pacotes.filter(p => p.pedidoId === this.pedidoAtualId);
      const idsUnicos = [...new Set<number>(pacotesDoNovoPedido.map(p => +p.pacoteId))].sort((a, b) => a - b);
      this.indicePacoteAtualPorPedido[this.pedidoAtualId] ??= 0;
      this.pacoteAtualId = idsUnicos[this.indicePacoteAtualPorPedido[this.pedidoAtualId] || 0] ?? 0;
    }
  }

  /** Navegação para trás entre pedidos */
  voltarPasso(): void {
    const indexAtual = this.pedidoIds.indexOf(this.pedidoAtualId);
    const anteriorIndex = indexAtual - 1;

    if (anteriorIndex >= 0) {
      this.pedidoAtualId = this.pedidoIds[anteriorIndex];

      const pacotesDoNovoPedido = this.pacotes.filter(p => p.pedidoId === this.pedidoAtualId);
      const idsUnicos = [...new Set<number>(pacotesDoNovoPedido.map(p => +p.pacoteId))].sort((a, b) => a - b);
      this.indicePacoteAtualPorPedido[this.pedidoAtualId] ??= 0;
      this.pacoteAtualId = idsUnicos[this.indicePacoteAtualPorPedido[this.pedidoAtualId] || 0] ?? 0;
    }
  }

  confirmar(): void {
    this.popupService.sucesso('Todos os pacotes carregados e confirmados!');
  }

  /** Recebe as cores geradas pelo componente 3D (se ele emitir) */
  receberCoresGeradas(cores: Map<string, string>) {
    this.coresPacotes = cores;
  }

  /** Salva o carregamento no backend (POST /api/carregamentos) */
  salvarCarregamento(): void {
    if (!this.caminhao || !this.pedidos?.length) {
      this.popupService.erro('Caminhão ou pedidos não informados.');
      return;
    }

    const body = {
      caminhao: { id: +this.caminhao.id },
      pedidos: this.pedidos.map((pedido: any, idx: number) => ({
        id: +(pedido.id ?? idx + 1),
        descricao: pedido.descricao ?? pedido.nome ?? `Pedido #${idx + 1}`,
        pacotes: (pedido.pacotes || []).map((p: any) => ({
          id: +p.id,
          nome: p.nome ?? null,
          comprimento: +p.comprimento,
          largura: +p.largura,
          altura: +p.altura,
          peso: +p.peso,
          rotacao: !!p.rotacao,
          fragil: !!p.fragil,
          quantidade: +p.quantidade || 1
        }))
      }))
    };

    this.loading = true;
    this.otimizarService.criarCarregamento(body).subscribe({
      next: () => {
        this.loading = false;
        this.popupService.sucesso('Carregamento salvo com sucesso!');
        // opcional: navegar para histórico/detalhe
        // this.router.navigate(['/historico']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.mensagem || err.message || 'Erro ao salvar carregamento.';
        this.popupService.erro(msg);
      }
    });
  }
}
