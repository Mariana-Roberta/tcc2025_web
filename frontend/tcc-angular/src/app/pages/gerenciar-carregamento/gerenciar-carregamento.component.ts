import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject} from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ScreenBackgroundComponent } from '../../components/screen-background/screen-background.component';
import {NgIf, NgForOf, DecimalPipe, CommonModule, Location} from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PopupService } from '../../services/popup.service';
import { CarregamentoService, CarregamentoResponse } from '../../services/carregamento.service';
import {PacoteService} from '../../services/pacote.service';

@Component({
  selector: 'app-gerenciar-carregamento',
  standalone: true,
  imports: [
    NavbarComponent,
    ScreenBackgroundComponent,
    CommonModule,
    NgIf,
    NgForOf,
    DecimalPipe
  ],
  templateUrl: './gerenciar-carregamento.component.html',
  styleUrl: './gerenciar-carregamento.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GerenciarCarregamentoComponent implements OnInit {
  // Lista vinda do backend
  carregamentos: CarregamentoResponse[] = [];

  // Paginação
  carregamentosPorPagina = 2;
  paginaAtual = 1;

  // >>> Estados controlados por ID (como string) <<<
  // Ex.: caminhaoExpandido['123'] = true  => carregamento de id=123 expandido
  caminhaoExpandido: Record<string, boolean> = {};
  // Ex.: pedidoExpandido['123']['77'] = true => pedido id=77 do carregamento 123 expandido
  pedidoExpandido: Record<string, Record<string, boolean>> = {};

  loading = false;

  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly carregamentoService = inject(CarregamentoService);
  private readonly authService = inject(AuthService);
  private readonly popupService = inject(PopupService);

  ngOnInit(): void {
    this.popupService.limpar();
    const usuario = this.authService.getUsuario();
    if (!usuario) {
      this.popupService.erro('Usuário não autenticado.');
      return;
    }
    this.buscarCarregamentos();
  }

  /** Ação: voltar para a rota anterior */
  voltar(): void {
    // Se houver histórico, volta; caso contrário, navega para uma rota segura (ex.: '/')
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigateByUrl('/');
    }
  }

  // ==== Listagem somente ====
  private buscarCarregamentos(): void {
    this.loading = true;
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.carregamentoService.listarPorUsuario(usuario.id!).subscribe({
        next: (lista) => {
          this.carregamentos = Array.isArray(lista) ? lista : [];

          // Conjunto de IDs atuais como STRING para evitar conflitos de tipo
          const idsAtuais = new Set(this.carregamentos.map(c => String(c.id)));

          // Limpa estados que não existem mais
          Object.keys(this.caminhaoExpandido).forEach(idKey => {
            if (!idsAtuais.has(idKey)) delete this.caminhaoExpandido[idKey];
          });
          Object.keys(this.pedidoExpandido).forEach(cidKey => {
            if (!idsAtuais.has(cidKey)) delete this.pedidoExpandido[cidKey];
          });

          this.loading = false;
          this.cdr.markForCheck(); // OnPush
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

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) this.paginaAtual++;
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 1) this.paginaAtual--;
  }

  irParaPagina(p: number): void {
    if (p >= 1 && p <= this.totalPaginas) this.paginaAtual = p;
  }


  // ==== Expansão por ID ====

  /** Abre/fecha o card do carregamento usando o ID (normalizado para string) */
  toggleCaminhao(carregamentoId: string | number): void {
    const key = String(carregamentoId);
    this.caminhaoExpandido[key] = !this.caminhaoExpandido[key];
    if (this.caminhaoExpandido[key] && !this.pedidoExpandido[key]) {
      this.pedidoExpandido[key] = {};
    }
  }

  /** Retorna se o carregamento (por ID) está aberto */
  isCaminhaoAberto(carregamentoId: string | number): boolean {
    return !!this.caminhaoExpandido[String(carregamentoId)];
  }

  /** Abre/fecha um pedido específico (por ID do carregamento e do pedido) */
  togglePedido(carregamentoId: string | number, pedidoId: string | number): void {
    const cKey = String(carregamentoId);
    const pKey = String(pedidoId);
    if (!this.pedidoExpandido[cKey]) this.pedidoExpandido[cKey] = {};
    this.pedidoExpandido[cKey][pKey] = !this.pedidoExpandido[cKey][pKey];
  }

  /** Retorna se um pedido (por IDs) está aberto */
  isPedidoAberto(carregamentoId: string | number, pedidoId: string | number): boolean {
    return !!this.pedidoExpandido[String(carregamentoId)]?.[String(pedidoId)];
  }

  /** Expande/recolhe todos os pedidos de um carregamento (por ID) */
  toggleTodosPedidos(carregamentoId: string | number, expandir: boolean): void {
    const cKey = String(carregamentoId);
    const carreg = this.carregamentos.find(c => String(c.id) === cKey);
    const pedidos = carreg?.pedidos ?? [];
    if (!this.pedidoExpandido[cKey]) this.pedidoExpandido[cKey] = {};
    pedidos.forEach((p, idx) => {
      const pKey = String(p?.id ?? idx); // fallback por índice se não houver id
      this.pedidoExpandido[cKey][pKey] = expandir;
    });
  }

  // ==== Navegação ====

  /** Agora recebe diretamente o ID correto (sem depender de índice/paginação) */
  visualizarCarregamento(idCarregamento: string | number): void {
    if (idCarregamento != null) {
      this.router.navigate(['/visualiza', idCarregamento]);
    }
  }

  // ==== Helpers ====

  /** Peso total de um pedido */
  calcularPesoPedido(pedido: CarregamentoResponse['pedidos'][number]): number {
    return (pedido?.pacotes || []).reduce((acc, p) => acc + ((p?.peso ?? 0) * (p?.quantidade ?? 0)), 0);
  }

  /** Total de itens de um pedido */
  contarItensPedido(pedido: CarregamentoResponse['pedidos'][number]): number {
    return (pedido?.pacotes || []).reduce((acc, p) => acc + (p?.quantidade ?? 0), 0);
  }

  /** Peso total do carregamento */
  calcularPesoCarreg(c: CarregamentoResponse): number {
    return (c?.pedidos || []).reduce((acc, ped) => acc + this.calcularPesoPedido(ped), 0);
  }

  /** Total de itens do carregamento */
  contarItensCarreg(c: CarregamentoResponse): number {
    return (c?.pedidos || []).reduce((acc, ped) => acc + this.contarItensPedido(ped), 0);
  }

  /** Percentual de uso do peso do caminhão */
  usoPesoPercentual(c: CarregamentoResponse): number {
    const pesoLimite = c?.caminhao?.pesoLimite ?? 0;
    if (!pesoLimite) return 0;
    const pesoTotal = this.calcularPesoCarreg(c);
    return Math.min(100, +((pesoTotal / pesoLimite) * 100).toFixed(1));
  }

  // trackBys usando o ID real
  trackByCarregamento = (_: number, item: CarregamentoResponse) => item.id;
  trackByPedido = (_: number, item: CarregamentoResponse['pedidos'][number]) => item?.id;
  trackByPacote = (_: number, item: CarregamentoResponse['pedidos'][number]['pacotes'][number]) => item?.id;

  /** Excluir um carregamento por ID */
excluirCarregamento(id: number | string): void {
  if (!id) return;

    this.loading = true;
    this.cdr.markForCheck();

    this.carregamentoService.excluir(id).subscribe({
      next: () => {
        this.popupService.sucesso('Carregamento excluído com sucesso.');

        // Remove da lista local
        const idStr = String(id);
        this.carregamentos = this.carregamentos.filter(c => String(c.id) !== idStr);

        // Remove estados de expansão
        delete this.caminhaoExpandido[idStr];
        delete this.pedidoExpandido[idStr];

        // Ajusta paginação caso a página atual fique vazia
        if (this.paginaAtual > this.totalPaginas) {
          this.paginaAtual = this.totalPaginas;
        }

        // Após excluir → recarrega a lista real do backend
        this.buscarCarregamentos();

        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err: { message: any; }) => {
        console.error('[Componente] Erro ao excluir carregamento:', err);
        this.popupService.erro(err?.message || 'Erro ao excluir carregamento.');
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

baixarPdf(id: number) {
  this.carregamentoService.baixarPdf(id).subscribe({
    next: (blob: Blob) => {
      // 1. Cria a URL temporária para o Blob
      const url = window.URL.createObjectURL(blob);
      
      // 2. Cria o elemento de link invisível
      const a = document.createElement('a');
      a.href = url;
      
      // 3. ESSENCIAL: Define o nome E força o comportamento de "Salvar como"
      // Sem essa linha, o navegador abre o PDF na mesma aba.
      a.download = `relatorio_carregamento_${id}.pdf`;

      // 4. Truque para compatibilidade (necessário para Firefox e alguns browsers)
      document.body.appendChild(a);
      
      // 5. Simula o clique
      a.click();

      // 6. Limpeza
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    error: (err: any) => {
      console.error("Erro ao baixar PDF", err);
    }
  });
}
}
