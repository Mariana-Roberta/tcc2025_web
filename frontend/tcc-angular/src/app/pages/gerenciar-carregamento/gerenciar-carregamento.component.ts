import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ScreenBackgroundComponent } from '../../components/screen-background/screen-background.component';
import { NgClass, NgIf, NgForOf, DecimalPipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PopupService } from '../../services/popup.service';
import { CarregamentoService, CarregamentoResponse } from '../../services/carregamento.service';

@Component({
  selector: 'app-gerenciar-carregamento',
  standalone: true,
  imports: [
    NavbarComponent,
    ScreenBackgroundComponent,
    CommonModule,
    NgClass,
    NgIf,
    NgForOf,
    DecimalPipe
  ],
  templateUrl: './gerenciar-carregamento.component.html',
  styleUrl: './gerenciar-carregamento.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GerenciarCarregamentoComponent implements OnInit {
  // o shape do backend (CarregamentoResponse)
  carregamentos: CarregamentoResponse[] = [];

  carregamentosPorPagina = 2;
  paginaAtual = 1;

  caminhaoExpandido: boolean[] = [];
  pedidoExpandido: { [cIndex: number]: { [pIndex: number]: boolean } } = {};

  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private popupService: PopupService,
    private cdr: ChangeDetectorRef,
    private carregamentoService: CarregamentoService
  ) {}

  ngOnInit(): void {
    this.popupService.limpar();
    const usuario = this.authService.getUsuario();
    if (!usuario) {
      this.popupService.erro('Usuário não autenticado.');
      return;
    }
    this.buscarDoLogado();
  }

  // ==== Listagem somente ====
  private buscarDoLogado(): void {
    this.loading = true;
    console.log('[Componente] Chamando service.listarDoUsuarioLogado()');
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.carregamentoService.listarPorUsuario(usuario.id).subscribe({
        next: (lista) => {
          console.log(lista);
          console.log('[Componente] Carregamentos recebidos do service:', lista);
          this.carregamentos = Array.isArray(lista) ? lista : [];
          this.caminhaoExpandido = this.carregamentos.map(() => false);
          this.pedidoExpandido = {};
          this.loading = false;
          this.cdr.markForCheck(); // OnPush: força atualização da view
        },
        error: (err) => {
          console.error('[Componente] Erro ao buscar carregamentos do logado:', err);
          this.popupService.erro(err?.message || 'Erro ao listar carregamentos.');
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  // ==== Paginação/calculados ====
  get totalPaginas(): number {
    return Math.ceil(this.carregamentos.length / this.carregamentosPorPagina) || 1;
  }

  get carregamentosPaginados(): CarregamentoResponse[] {
    const inicio = (this.paginaAtual - 1) * this.carregamentosPorPagina;
    return this.carregamentos.slice(inicio, inicio + this.carregamentosPorPagina);
  }

  proximaPagina(): void { if (this.paginaAtual < this.totalPaginas) this.paginaAtual++; }
  paginaAnterior(): void { if (this.paginaAtual > 1) this.paginaAtual--; }
  irParaPagina(p: number): void { if (p >= 1 && p <= this.totalPaginas) this.paginaAtual = p; }

  toggleCaminhao(cIndexAbs: number): void {
    this.caminhaoExpandido[cIndexAbs] = !this.caminhaoExpandido[cIndexAbs];
    if (this.caminhaoExpandido[cIndexAbs] && !this.pedidoExpandido[cIndexAbs]) {
      this.pedidoExpandido[cIndexAbs] = {};
    }
  }

  togglePedido(cIndexAbs: number, pIndex: number): void {
    if (!this.pedidoExpandido[cIndexAbs]) this.pedidoExpandido[cIndexAbs] = {};
    this.pedidoExpandido[cIndexAbs][pIndex] = !this.pedidoExpandido[cIndexAbs][pIndex];
  }

  isPedidoAberto(cIndexAbs: number, pIndex: number): boolean {
    return !!this.pedidoExpandido[cIndexAbs]?.[pIndex];
  }

  isCaminhaoAberto(cIndexAbs: number): boolean {
    return !!this.caminhaoExpandido[cIndexAbs];
  }

  toggleTodosPedidos(cIndexAbs: number, expandir: boolean): void {
    const pedidos = this.carregamentos[cIndexAbs]?.pedidos ?? [];
    if (!this.pedidoExpandido[cIndexAbs]) this.pedidoExpandido[cIndexAbs] = {};
    pedidos.forEach((_, pIndex) => this.pedidoExpandido[cIndexAbs][pIndex] = expandir);
  }

  visualizarCarregamento(cIndexAbs: number): void {
    const idCarregamento = this.carregamentos[cIndexAbs]?.id;
    if (idCarregamento) {
      this.router.navigate(['/visualizar-carregamento', idCarregamento]);
    }
  }

  // Helpers (tratam pedidos vazios)
  calcularPesoPedido(pedido: CarregamentoResponse['pedidos'][number]): number {
    return (pedido.pacotes || []).reduce((acc, p) => acc + ((p.peso ?? 0) * (p.quantidade ?? 0)), 0);
    // se no futuro quiser peso unitário x qtd
  }
  contarItensPedido(pedido: CarregamentoResponse['pedidos'][number]): number {
    return (pedido.pacotes || []).reduce((acc, p) => acc + (p.quantidade ?? 0), 0);
  }
  calcularPesoCarreg(c: CarregamentoResponse): number {
    return (c.pedidos || []).reduce((acc, ped) => acc + this.calcularPesoPedido(ped), 0);
  }
  contarItensCarreg(c: CarregamentoResponse): number {
    return (c.pedidos || []).reduce((acc, ped) => acc + this.contarItensPedido(ped), 0);
  }
  usoPesoPercentual(c: CarregamentoResponse): number {
    const pesoLimite = c.caminhao?.pesoLimite ?? 0;
    if (!pesoLimite) return 0;
    const pesoTotal = this.calcularPesoCarreg(c);
    return Math.min(100, +((pesoTotal / pesoLimite) * 100).toFixed(1));
  }

  // trackBys usando o ID do CARREGAMENTO (não do caminhão)
  trackByCarregamento = (_: number, item: CarregamentoResponse) => item.id;
  trackByPedido = (_: number, item: CarregamentoResponse['pedidos'][number]) => item.id;
  trackByPacote = (_: number, item: CarregamentoResponse['pedidos'][number]['pacotes'][number]) => item.id;
}
