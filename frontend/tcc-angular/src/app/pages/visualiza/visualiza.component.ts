import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
export class VisualizaComponent implements OnInit {
  caminhao: any;
  pedidos: any[] = [];
  pacotes: any[] = []; // saída da API de otimização
  coresPacotes: Map<string, string> = new Map();

  // infos de cabeçalho
  idCarregamento?: number;
  dataCriacao?: string;

  pedidoIds: number[] = [];
  pedidoAtualId = 0;
  pacoteAtualId = 0;

  indicePacoteAtualPorPedido: { [pedidoId: number]: number } = {};
  loading = true;
  isVisualiza = true;

  // injeções
  private readonly router = inject(Router);
  private readonly rota = inject(ActivatedRoute);
  private readonly otimizarService = inject(OtimizarService);
  private readonly popupService = inject(PopupService);

  ngOnInit(): void {
  // 1) Tenta pegar dados via Navigation Extras (primeira navegação)
  const nav = this.router.getCurrentNavigation();
  const navState = (nav?.extras?.state as { dados?: any }) ?? undefined;

  // 2) Se não houver (ex.: após F5), tenta via history.state (Angular preserva)
  const histState = (window.history?.state as { dados?: any }) ?? undefined;

  const dados = navState?.dados ?? histState?.dados;

  if (dados) {
    // ---- MODO "sem :id" (dados já vieram na navegação) ----
    this.isVisualiza = false;
    this.idCarregamento = dados.id;
    this.dataCriacao   = dados.dataCriacao;
    this.caminhao      = dados.caminhao;
    this.pedidos       = Array.isArray(dados.pedidos) ? dados.pedidos : [];

    if (!this.caminhao || !this.pedidos.length) {
      this.loading = false;
      this.popupService.erro('Dados insuficientes do carregamento.');
      return;
    }

    this.loading = true;
    this.enviarParaOtimizar(this.caminhao, this.pedidos);
    return;
  }

  // 3) Fallback: ler /visualiza/:id e buscar no backend
  this.rota.paramMap.subscribe({
    next: (params) => {
      const idParam = params.get('id');

      // Se não há :id e também não havia state, apenas informe suavemente
      if (idParam == null) {
        this.loading = false;
        // Dê uma dica de como abrir corretamente sem acusar "inválido"
        // (troque para popupService.info se preferir)
        this.popupService.erro('Abra esta tela a partir da lista ou use a rota /visualiza/:id.');
        return;
      }

      const id = Number(idParam);
      if (!Number.isFinite(id) || id <= 0) {
        this.loading = false;
        this.popupService.erro('ID de carregamento inválido.');
        return;
      }

      this.idCarregamento = id;
      this.isVisualiza = true;
      this.loading = true;

      this.otimizarService.obterCarregamento(id).subscribe({
        next: (carregamento) => {
          if (!carregamento) {
            this.loading = false;
            this.popupService.erro('Carregamento não encontrado.');
            return;
          }

          this.dataCriacao = carregamento.dataCriacao;
          this.caminhao    = carregamento.caminhao;
          this.pedidos     = carregamento.pedidos || [];

          if (!this.caminhao || !this.pedidos.length) {
            this.loading = false;
            this.popupService.erro('Dados insuficientes do carregamento.');
            return;
          }

          this.enviarParaOtimizar(this.caminhao, this.pedidos);
        },
        error: (err) => {
          this.loading = false;
          this.popupService.erro(err?.message || 'Erro ao buscar carregamento.');
        }
      });
    },
    error: () => {
      this.loading = false;
      this.popupService.erro('Não foi possível ler o parâmetro da rota.');
    }
  });
}


  /** Chama o endpoint de otimização e prepara a visualização */
 enviarParaOtimizar(caminhao: any, pedidos: any[]): void {
  // 1) Guarde a ORDEM dos pedidos que o UI vai usar
  const pedidoIdOrder = pedidos.map((p, idx) => +(p?.id ?? idx + 1));

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
      id: +(pedido.id ?? idx + 1), // <-- importante: o mesmo ID usado em pedidoIdOrder
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
      // 1) Conjunto/ordem oficial de IDs de pedidos vindos do backend
      const pedidoIdSet = new Set(pedidoIdOrder);

      // 2) Detecta como o otimizador está codificando idPedido
      type ModoId = 'REAL' | 'ONE_BASED' | 'ZERO_BASED';
      const idsOtim = (dados || []).map((d: any) => Number(d?.idPedido)).filter(Number.isFinite);

      const ehReal = idsOtim.length > 0 && idsOtim.every(id => pedidoIdSet.has(id));
      const ehOneBased = idsOtim.length > 0
        && Math.min(...idsOtim) >= 1
        && Math.max(...idsOtim) <= pedidoIdOrder.length;
      const ehZeroBased = idsOtim.length > 0
        && Math.min(...idsOtim) >= 0
        && Math.max(...idsOtim) < pedidoIdOrder.length;

      const modo: ModoId = ehReal ? 'REAL' : (ehOneBased ? 'ONE_BASED' : (ehZeroBased ? 'ZERO_BASED' : 'REAL'));

      // 3) Tradutor de idPedido cru -> ID real do pedido
      const translatePedidoId = (raw: number) => {
        const n = Number(raw);
        if (!Number.isFinite(n)) return n;
        if (modo === 'REAL') return n;
        if (modo === 'ONE_BASED') {
          const idx = n - 1;                // 1..N -> 0..N-1
          return pedidoIdOrder[idx] ?? n;
        }
        // ZERO_BASED
        return pedidoIdOrder[n] ?? n;       // 0..N-1
      };

      // 4) Normaliza pacotes com coerção segura + fallbacks
      this.pacotes = (dados || []).map((d: any, idx: number) => {
        const x = Number(d?.x) || 0;
        const y = Number(d?.y) || 0;
        const z = Number(d?.z) || 0;
        const comprimento = Number(d?.comprimento) || 0;
        const largura = Number(d?.largura) || 0;
        const altura = Number(d?.altura) || 0;

        // pacoteId pode não vir: usa índice como fallback
        const pacoteIdBruto = Number(d?.pacoteId);
        const pacoteId = Number.isFinite(pacoteIdBruto) ? pacoteIdBruto : idx;

        const pedidoId = translatePedidoId(Number(d?.idPedido));

        return { x, y, z, comprimento, largura, altura, pacoteId, pedidoId };
      });

      // 5) Use SEMPRE a ordem vinda do array `pedidos` do backend
      this.pedidoIds = pedidoIdOrder.slice();
      this.pedidoAtualId = this.pedidoIds.length > 0 ? this.pedidoIds[0] : -1;

      // 6) Inicialize o pacote atual do 1º pedido (se houver)
      const pacotesDoPedido = this.pacotes.filter(p => p.pedidoId === this.pedidoAtualId);
      const primeirosIds = [...new Set(pacotesDoPedido.map(p => p.pacoteId))].sort((a, b) => a - b);
      this.pacoteAtualId = primeirosIds[0] ?? 0;

      this.loading = false;
    },
    error: (err) => {
      this.popupService.erro(err?.message || 'Erro ao otimizar.');
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

  get indicePedidoAtual(): number {
    return this.pedidoIds.indexOf(this.pedidoAtualId);
  }

  get isPrimeiroPedido(): boolean {
    return this.indicePedidoAtual <= 0;
  }

  get isUltimoPedido(): boolean {
    return this.indicePedidoAtual >= this.pedidoIds.length - 1;
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
        this.isVisualiza = true;
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.mensagem || err.message || 'Erro ao salvar carregamento.';
        this.popupService.erro(msg);
      }
    });
  }
  ehNumero(v: any): boolean {
  const n = typeof v === 'number' ? v : +v;
  return Number.isFinite(n);
}

}
