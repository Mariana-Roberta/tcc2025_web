import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    private caminhaoService: CaminhaoService,
    private pacoteService: PacoteService,
    private authService: AuthService,
    private popupService: PopupService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarCaminhoes();
    this.carregarPacotes();
  }

  carregarCaminhoes() {
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.caminhaoService.listarPorUsuario(usuario.id).subscribe({
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
      this.pacoteService.listarPorUsuario(usuario.id).subscribe({
        next: (dados) => this.pacotes = dados,
        error: () => this.popupService.erro('Erro ao carregar pacotes.')
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

    const dto = {
      caminhao: {
        ...this.caminhaoSelecionado,
        usuario: { id: this.caminhaoSelecionado.usuario.id }
      },
      pedidos: this.pedidos.map((pedido, index) => ({
        id: index,
        descricao: pedido.nome,
        pacotes: pedido.pacotes.map(p => ({
          id: p.pacote.id,
          nome: p.pacote.nome,
          comprimento: p.pacote.comprimento,
          largura: p.pacote.largura,
          altura: p.pacote.altura,
          peso: p.pacote.peso,
          fragil: p.pacote.fragil,
          rotacao: p.pacote.rotacao,
          quantidade: p.quantidade
        }))
      }))
    };

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

}
