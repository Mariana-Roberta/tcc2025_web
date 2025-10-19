import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ScreenBackgroundComponent } from '../../components/screen-background/screen-background.component';
import { PopupComponent } from '../../components/popup/popup.component';

import { Caminhao } from '../../model/caminhao.model';
import { Pacote } from '../../model/pacote.model';
import { Pedido } from '../../model/pedido.model';
import { CarregamentoPacote } from '../../model/carregamento-pacote.model';

import { CaminhaoService } from '../../services/caminhao.service';
import { PacoteService } from '../../services/pacote.service';
import { AuthService } from '../../services/auth.service';
import { PopupService } from '../../services/popup.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-otimiza',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    ScreenBackgroundComponent,
    PopupComponent
  ],
  templateUrl: './otimiza.component.html',
  styleUrl: './otimiza.component.css'
})
export class OtimizaComponent implements OnInit {
  caminhoes: Caminhao[] = [];
  pacotes: Pacote[] = [];

  caminhaoSelecionado: Caminhao | null = null;
  pacotesSelecionados: Pacote[] = [];
  quantidadesSelecionadas: { [pacoteId: number]: number } = {};
  quantidadesConfirmadas: { [pacoteId: number]: boolean } = {};

  carregamentoPacote: CarregamentoPacote[] = [];
  pedidos: Pedido[] = [];
  pedidoAtual: Pedido | null = null;
  nomePedido: string = '';

  etapaAtual: 'caminhao' | 'pacotes' = 'caminhao';

  filtroCaminhao: string = '';
  filtroPacote: string = '';

  constructor(
    private readonly caminhaoService: CaminhaoService,
    private readonly pacoteService: PacoteService,
    private readonly authService: AuthService,
    private readonly popupService: PopupService,
    private readonly router: Router,
    private readonly location: Location,
    private readonly http: HttpClient
  ) {}

  /** Ação: voltar para a rota anterior */
  voltar(): void {
    // Se houver histórico, volta; caso contrário, navega para uma rota segura (ex.: '/')
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigateByUrl('/');
    }
  }

  ngOnInit() {
    this.popupService.limpar();
    this.carregarCaminhoes();
    this.carregarPacotes();
  }

  carregarCaminhoes() {
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.caminhaoService.listarPorUsuario(usuario.id!).subscribe({
        next: (dados) => this.caminhoes = dados,
        error: () => this.popupService.erro('Erro ao carregar caminhões.')
      });
    } else {
      this.popupService.erro('Usuário não autenticado.');
    }
  }

  carregarPacotes() {
  const usuario = this.authService.getUsuario();
  if (usuario) {
    this.pacoteService.listarPorUsuario(usuario.id!).subscribe({
      next: (dados) => this.pacotes = dados,
      error: (err) => {
        console.error('Falha ao carregar pacotes:', err);
        const msg = err?.error?.mensagem || err?.statusText || err?.message || 'Erro ao carregar pacotes.';
        this.popupService.erro(msg);
      }
    });
  } else {
    this.popupService.erro('Usuário não autenticado.');
  }
}


  selecionarCaminhao(c: Caminhao) {
    this.caminhaoSelecionado = c;
    this.pacotesSelecionados = [];
    this.quantidadesSelecionadas = {};
    this.quantidadesConfirmadas = {};
    this.carregamentoPacote = [];
  }

  togglePacote(pacote: Pacote) {
    const index = this.pacotesSelecionados.indexOf(pacote);
    if (index >= 0) {
      this.pacotesSelecionados.splice(index, 1);
      delete this.quantidadesSelecionadas[pacote.id!];
      delete this.quantidadesConfirmadas[pacote.id!];
      this.carregamentoPacote = this.carregamentoPacote.filter(c => c.pacote.id !== pacote.id);
    } else {
      this.pacotesSelecionados.push(pacote);
      this.quantidadesSelecionadas[pacote.id!] = 1;
      this.quantidadesConfirmadas[pacote.id!] = false;
      this.carregamentoPacote.push({ pacote, quantidade: 1 });
    }
  }

  confirmarQuantidade(pacote: Pacote) {
    if (this.quantidadesSelecionadas[pacote.id!] > 0) {
      this.quantidadesConfirmadas[pacote.id!] = true;
    } else {
      this.popupService.erro('A quantidade deve ser maior que 0.');
    }
  }

  desfazerConfirmacao(pacote: Pacote) {
    this.quantidadesConfirmadas[pacote.id!] = false;
  }

  cancelarSelecao(pacote: Pacote) {
    const index = this.pacotesSelecionados.indexOf(pacote);
    if (index >= 0) {
      this.pacotesSelecionados.splice(index, 1);
      delete this.quantidadesSelecionadas[pacote.id!];
      delete this.quantidadesConfirmadas[pacote.id!];
      this.carregamentoPacote = this.carregamentoPacote.filter(c => c.pacote.id !== pacote.id);
    }
  }

  continuarParaPacotes() {
    if (!this.caminhaoSelecionado) {
      this.popupService.erro('Selecione um caminhão antes de continuar.');
      return;
    }
    this.etapaAtual = 'pacotes';
  }

  todosPacotesConfirmados(): boolean {
    return this.pacotesSelecionados.every(p => this.quantidadesConfirmadas[p.id!] === true);
  }

  criarNovoPedido() {
    let nome = this.nomePedido.trim();
    if (!nome) {
      let contador = 1;
      while (this.pedidos.find(p => p.nome === `Pedido #${contador}`)) contador++;
      nome = `Pedido #${contador}`;
    }

    this.pedidoAtual = { nome, pacotes: [] };
    this.pacotesSelecionados = [];
    this.quantidadesSelecionadas = {};
    this.quantidadesConfirmadas = {};
    this.carregamentoPacote = [];
    this.nomePedido = '';

    this.popupService.sucesso('Novo pedido iniciado!');
  }

  confirmarPedido() {
    if (!this.pedidoAtual) {
      this.popupService.erro('Nenhum pedido em andamento.');
      return;
    }

    const pacotes = this.pacotesSelecionados.map(p => ({
      pacote: p,
      quantidade: this.quantidadesSelecionadas[p.id!],
      confirmado: this.quantidadesConfirmadas[p.id!]
    }));

    this.pedidoAtual.pacotes = pacotes;
    this.pedidos.push(this.pedidoAtual);
    this.pedidoAtual = null;

    this.popupService.sucesso('Pedido confirmado com sucesso!');
  }

  confirmarOtimizacao() {
  if (!this.caminhaoSelecionado) {
    this.popupService.erro('Selecione um caminhão para otimização.');
    return;
  }
  if (this.pedidos.length === 0) {
    this.popupService.erro('Adicione pelo menos um pedido antes de otimizar.');
    return;
  }

  // 1) Validação prévia: nenhum pacote pode estar sem ID
  for (const ped of this.pedidos) {
    for (const pp of ped.pacotes) {
      if (!pp?.pacote || pp.pacote.id == null) {
        this.popupService.erro(`Há um pacote sem ID no pedido "${ped.nome}".`);
        return; // evita continuar e elimina o erro TS
      }
    }
  }

  // 2) Montagem do DTO (agora podemos usar "!" com segurança)
  const dto = {
    caminhao: {
      ...this.caminhaoSelecionado,
      usuario: { id: this.caminhaoSelecionado.usuario.id }
    },
    pedidos: this.pedidos.map((pedido, index) => ({
      id: index,
      descricao: pedido.nome,
      pacotes: pedido.pacotes.map(p => ({
        id: +p.pacote.id!,                 // <- validado acima
        nome: p.pacote.nome ?? '',
        comprimento: p.pacote.comprimento,// se seu modelo permitir null, trate aqui
        largura: p.pacote.largura,
        altura: p.pacote.altura,
        peso: p.pacote.peso,
        fragil: !!p.pacote.fragil,
        rotacao: !!p.pacote.rotacao,
        quantidade: p.quantidade ?? 1
      }))
    }))
  };

  console.log('Body a enviar (otimizar -> state):', dto);
  this.router.navigate(['/visualiza'], { state: { dados: dto } });
  this.popupService.sucesso('Otimização iniciada com sucesso!');
}


get caminhoesFiltrados(): Caminhao[] {
  const filtro = this.filtroCaminhao.trim().toLowerCase();
  if (!filtro) return this.caminhoes;

  return this.caminhoes.filter(c => {
    const nome = c.nome?.toLowerCase() || '';
    const peso = c.pesoLimite?.toString() || '';
    const dimensoes = `${c.comprimento}x${c.largura}x${c.altura}`.toLowerCase();

    return (
      nome.includes(filtro) ||
      peso.includes(filtro) ||
      dimensoes.includes(filtro)
    );
  });
}

get pacotesFiltrados(): Pacote[] {
  const filtro = this.filtroPacote.trim().toLowerCase();
  if (!filtro) return this.pacotes;

  return this.pacotes.filter(p => {
    const nome = p.nome?.toLowerCase() || '';
    const peso = p.peso?.toString() || '';
    const dimensoes = `${p.comprimento}x${p.largura}x${p.altura}`.toLowerCase();

    return (
      nome.includes(filtro) ||
      peso.includes(filtro) ||
      dimensoes.includes(filtro)
    );
  });
}

async importarCSV(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    const conteudo = e.target?.result as string;
    if (!conteudo) return;

    try {
      // Detecta separador
      const firstLine = conteudo.split(/\r?\n/).find(l => l.trim().length > 0) || '';
      const sep = firstLine.includes(';') && !firstLine.includes(',') ? ';' : ',';
      const linhas = conteudo.split(/\r?\n/).filter(l => l.trim().length > 0);
      const cabecalho = linhas[0].split(sep).map(h => h.trim().toLowerCase());

      const idxPedido = cabecalho.indexOf('pedido');
      const idxNome = cabecalho.indexOf('nome');
      const idxComprimento = cabecalho.indexOf('comprimento');
      const idxLargura = cabecalho.indexOf('largura');
      const idxAltura = cabecalho.indexOf('altura');
      const idxPeso = cabecalho.indexOf('peso');
      const idxFragil = cabecalho.indexOf('fragil');
      const idxRotacao = cabecalho.indexOf('rotacao');
      const idxQuantidade = cabecalho.indexOf('quantidade');

      if (idxPedido === -1) {
        this.popupService.erro('O CSV precisa conter uma coluna "pedido".');
        return;
      }

      const usuario = this.authService.getUsuario();
      if (!usuario) {
        this.popupService.erro('Usuário não autenticado.');
        return;
      }

      const pacotesMap = new Map<string, Pacote>();
      const pedidosMap = new Map<string, Pedido>();

      const toBool = (v: string | undefined) => v?.trim().toLowerCase() === 'true' || v?.trim() === '1';
      const toNumberSafe = (v: string | undefined) => {
        const n = Number((v ?? '').replace(',', '.'));
        return Number.isFinite(n) ? n : 0;
      };

      // percorre as linhas de dados
      for (let i = 1; i < linhas.length; i++) {
        const cols = linhas[i].split(sep).map(c => c.trim());
        if (cols.length === 0 || cols.every(c => c === '')) continue;

        const nomePedido = cols[idxPedido]?.trim() || `Pedido ${i}`;
        const quantidadeLida = idxQuantidade >= 0 ? Math.max(1, Math.floor(Number(cols[idxQuantidade] ?? 1))) : 1;

        // Pacote temporário
        let pacote: Pacote = {
          id: undefined, // ainda não salvo
          nome: cols[idxNome]?.trim() || `Pacote ${i}`,
          comprimento: toNumberSafe(cols[idxComprimento]),
          largura: toNumberSafe(cols[idxLargura]),
          altura: toNumberSafe(cols[idxAltura]),
          peso: toNumberSafe(cols[idxPeso]),
          fragil: toBool(cols[idxFragil]),
          rotacao: toBool(cols[idxRotacao]),
          usuario: { id: usuario.id! }
        };

        // Salva no backend se não existir
        try {
          const res: any = await this.pacoteService.salvar(pacote).toPromise();
          pacote.id = res.id; // atualiza ID retornado
        } catch (err) {
          console.error('Erro ao salvar pacote', pacote.nome, err);
          this.popupService.erro(`Não foi possível salvar o pacote "${pacote.nome}" no sistema.`);
          return;
        }

        pacotesMap.set(`${nomePedido}-${pacote.nome}`, pacote);

        if (!pedidosMap.has(nomePedido)) {
          pedidosMap.set(nomePedido, { nome: nomePedido, pacotes: [] });
        }

        // adiciona o pacote ao pedido com a quantidade lida
        pedidosMap.get(nomePedido)!.pacotes.push({
          pacote,
          quantidade: quantidadeLida,
          confirmado: true
        });
      }

      // Atualiza estado geral
      this.pacotes = Array.from(pacotesMap.values());
      this.pedidos = Array.from(pedidosMap.values());

      // 🔹 Preenche os estados necessários para habilitar o botão
      this.pacotesSelecionados = [...this.pacotes];
      this.quantidadesSelecionadas = {};
      this.quantidadesConfirmadas = {};
      for (const ped of this.pedidos) {
        for (const pp of ped.pacotes) {
          const id = pp.pacote.id!;
          this.quantidadesSelecionadas[id] = pp.quantidade ?? 1;
          this.quantidadesConfirmadas[id] = true;
        }
      }

      this.popupService.sucesso('Pedidos importados e pacotes salvos com sucesso!');
      console.log('Pedidos importados:', this.pedidos);

    } catch (err) {
      console.error('Erro ao processar CSV:', err);
      this.popupService.erro('Erro ao ler o arquivo CSV.');
    }
  };

  reader.readAsText(file, 'UTF-8');
}



}
