import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Caminhao} from '../../model/caminhao.model';
import {Router} from '@angular/router';
import {ScreenBackgroundComponent} from '../../components/screen-background/screen-background.component';
import {CaminhaoService} from '../../services/caminhao.service';
import {AuthService} from '../../services/auth.service';
import {PacoteService} from '../../services/pacote.service';
import {Pacote} from '../../model/pacote.model';
import {FormsModule} from '@angular/forms';
import {CarregamentoPacote} from '../../model/carregamento-pacote.model';
import { Pedido } from '../../model/pedido.model';

@Component({
  selector: 'app-otimiza',
  standalone: true,
  imports: [
    NavbarComponent,
    NgClass,
    NgForOf,
    NgIf,
    ScreenBackgroundComponent,
    FormsModule
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

  carregamentoPacote: CarregamentoPacote[] = [];

  pedidos: Pedido[] = [];
  pedidoAtual: Pedido | null = null;
  nomePedido: string = '';

  constructor(private caminhaoService: CaminhaoService, private pacoteService: PacoteService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.carregarCaminhoes();
    this.carregarPacotes();
  }

  carregarCaminhoes() {
    /*const usuario = this.authService.getUsuario();
    if (usuario) {
      this.caminhaoService.listarPorUsuario(usuario.id).subscribe({
        next: (dados: Caminhao[]) => this.caminhoes = dados,
        error: (erro: any) => console.error('Erro ao carregar caminhões:', erro)
      });
    }*/
   this.caminhoes = [
  {
    id: 1,
    nome: 'Caminhão Baú',
    comprimento: 6.5,
    largura: 2.5,
    altura: 2.8,
    pesoLimite: 8000,
    usuario: { id: 1 }
  },
  {
    id: 2,
    nome: 'Caminhão Toco',
    comprimento: 7.2,
    largura: 2.6,
    altura: 3.0,
    pesoLimite: 10000,
    usuario: { id: 1 }
  },
  {
    id: 3,
    nome: 'Caminhão Truck',
    comprimento: 9.5,
    largura: 2.6,
    altura: 3.2,
    pesoLimite: 14000,
    usuario: { id: 1 }
  },
  {
    id: 4,
    nome: 'Caminhão 3/4',
    comprimento: 5.5,
    largura: 2.3,
    altura: 2.5,
    pesoLimite: 6000,
    usuario: { id: 1 }
  },
  {
    id: 5,
    nome: 'Caminhão Carreta',
    comprimento: 12.0,
    largura: 2.6,
    altura: 3.5,
    pesoLimite: 32000,
    usuario: { id: 1 }
  },
  {
    id: 6,
    nome: 'Caminhão Bitrem',
    comprimento: 14.0,
    largura: 2.6,
    altura: 3.6,
    pesoLimite: 36000,
    usuario: { id: 1 }
  },
  {
    id: 7,
    nome: 'Caminhão Cegonha',
    comprimento: 13.5,
    largura: 2.6,
    altura: 4.0,
    pesoLimite: 25000,
    usuario: { id: 1 }
  },
  {
    id: 8,
    nome: 'Caminhão Graneleiro',
    comprimento: 10.5,
    largura: 2.6,
    altura: 3.3,
    pesoLimite: 18000,
    usuario: { id: 1 }
  },
  {
    id: 9,
    nome: 'Caminhão Tanque',
    comprimento: 9.0,
    largura: 2.5,
    altura: 3.0,
    pesoLimite: 15000,
    usuario: { id: 1 }
  },
  {
    id: 10,
    nome: 'Caminhão Plataforma',
    comprimento: 8.0,
    largura: 2.5,
    altura: 2.7,
    pesoLimite: 11000,
    usuario: { id: 1 }
  }
];

  }

  carregarPacotes() {
    /*const usuario = this.authService.getUsuario();
    if (usuario) {
      this.pacoteService.listarPorUsuario(usuario.id).subscribe({
        next: (dados: Pacote[]) => this.pacotes = dados,
        error: (erro: any) => console.error('Erro ao carregar caminhões:', erro)
      });
    }*/
   this.pacotes = [
    {
      id: 1,
      nome: 'Pacote Pequeno',
      comprimento: 0.5,
      largura: 0.4,
      altura: 0.3,
      peso: 5,
      fragil: true,
      usuario: { id: 1 }
    },
    {
      id: 2,
      nome: 'Caixa de Ferramentas',
      comprimento: 0.6,
      largura: 0.5,
      altura: 0.4,
      peso: 12,
      fragil: false,
      usuario: { id: 1 }
    },
    {
      id: 3,
      nome: 'Pacote Médio',
      comprimento: 1.0,
      largura: 0.6,
      altura: 0.5,
      peso: 25,
      fragil: false,
      usuario: { id: 1 }
    },
    {
      id: 4,
      nome: 'Equipamento Eletrônico',
      comprimento: 0.9,
      largura: 0.7,
      altura: 0.6,
      peso: 18,
      fragil: false,
      usuario: { id: 1 }
    },
    {
      id: 5,
      nome: 'Caixa Grande',
      comprimento: 1.2,
      largura: 1.0,
      altura: 0.8,
      peso: 40,
      fragil: false,
      usuario: { id: 1 }
    },
    {
      id: 6,
      nome: 'Caixa Térmica',
      comprimento: 0.7,
      largura: 0.5,
      altura: 0.5,
      peso: 8,
      fragil: true,
      usuario: { id: 1 }
    },
    {
      id: 7,
      nome: 'Pacote Leve',
      comprimento: 0.4,
      largura: 0.3,
      altura: 0.2,
      peso: 2,
      fragil: false,
      usuario: { id: 1 }
    },
    {
      id: 8,
      nome: 'TV Embalada',
      comprimento: 1.3,
      largura: 0.8,
      altura: 0.2,
      peso: 22,
      fragil: true,
      usuario: { id: 1 }
    },
    {
      id: 9,
      nome: 'Micro-ondas',
      comprimento: 0.6,
      largura: 0.5,
      altura: 0.4,
      peso: 14,
      fragil: false,
      usuario: { id: 1 }
    },
    {
      id: 10,
      nome: 'Pacote Pesado',
      comprimento: 1.0,
      largura: 0.8,
      altura: 0.7,
      peso: 50,
      fragil: false,
      usuario: { id: 1 }
    }
  ];
  }

  selecionarCaminhao(c: any) {
    this.caminhaoSelecionado = c;
    this.pacotesSelecionados = [];
  }

  togglePacote(pacote: any): void {
    const index = this.pacotesSelecionados.indexOf(pacote);

    if (index >= 0) {
      // Remove o pacote da seleção
      this.pacotesSelecionados.splice(index, 1);
      delete this.quantidadesSelecionadas[pacote.id];
      delete this.quantidadesConfirmadas[pacote.id];
      // Remove o carregamento correspondente
      this.carregamentoPacote = this.carregamentoPacote.filter(c => c.pacote.id !== pacote.id);
    } else {
      // Adiciona o pacote à seleção
      this.pacotesSelecionados.push(pacote);
      this.quantidadesSelecionadas[pacote.id] = 1;
      this.quantidadesConfirmadas[pacote.id] = false;
      // Cria um novo carregamento
      this.carregamentoPacote.push({
        pacote: pacote,
        quantidade: this.quantidadesSelecionadas[pacote.id]
      });
    }
  }

  // Adicione no seu componente:
  quantidadesConfirmadas: { [id: number]: boolean } = {};

  confirmarQuantidade(pacote: any): void {
    const quantidade = this.quantidadesSelecionadas[pacote.id];
    if (quantidade > 0) {
      this.quantidadesConfirmadas[pacote.id] = true;
    }
  }

  desfazerConfirmacao(pacote: Pacote): void {
  if (pacote.id !== undefined) {
    this.quantidadesConfirmadas[pacote.id] = false;
  }
}

cancelarSelecao(pacote: Pacote): void {
  const index = this.pacotesSelecionados.indexOf(pacote);
  if (index >= 0 && pacote.id !== undefined) {
    this.pacotesSelecionados.splice(index, 1);
    delete this.quantidadesSelecionadas[pacote.id];
    delete this.quantidadesConfirmadas[pacote.id];
    this.carregamentoPacote = this.carregamentoPacote.filter(c => c.pacote.id !== pacote.id);
  }
}


  etapaAtual: 'caminhao' | 'pacotes' = 'caminhao';

  continuarParaPacotes() {
    if (this.caminhaoSelecionado) {
      this.etapaAtual = 'pacotes';
    }
  }

  todosPacotesConfirmados(): boolean {
    return this.pacotesSelecionados.every(pacote =>
      pacote.id !== undefined && this.quantidadesConfirmadas[pacote.id]
    );
  }

  confirmarOtimizacao(): void {
  if (!this.caminhaoSelecionado || this.pedidos.length === 0) {
    console.warn('Caminhão ou pedidos não definidos.');
    return;
  }

  const dto = {
    caminhao: {
      id: this.caminhaoSelecionado.id,
      nome: this.caminhaoSelecionado.nome,
      comprimento: this.caminhaoSelecionado.comprimento,
      largura: this.caminhaoSelecionado.largura,
      altura: this.caminhaoSelecionado.altura,
      pesoLimite: this.caminhaoSelecionado.pesoLimite,
      usuario: {
        id: this.caminhaoSelecionado.usuario.id
      }
    },
    pedidos: this.pedidos.map((pedido, index) => ({
      id: index + 1, // ou algum ID real se houver
      descricao: pedido.nome,
      pacotes: pedido.pacotes.map(p => ({
        id: p.pacote.id,
        nome: p.pacote.nome,
        comprimento: p.pacote.comprimento,
        largura: p.pacote.largura,
        altura: p.pacote.altura,
        peso: p.pacote.peso,
        fragil: p.pacote.fragil,
        quantidade: p.quantidade
      }))
    }))
  };

  // Aqui você pode enviar via HTTP ou apenas navegar com os dados
  this.router.navigate(['/visualiza'], {
    state: { dados: dto }
  });
}

criarNovoPedido() {
  let nome = this.nomePedido.trim();
  if (!nome) {
    let contador = 1;
    while (this.pedidos.find(p => p.nome === `Pedido #${contador}`)) {
      contador++;
    }
    nome = `Pedido #${contador}`;
  }

  this.pedidoAtual = {
    nome: nome,
    pacotes: []
  };

  this.pacotesSelecionados = [];
  this.quantidadesSelecionadas = {};
  this.quantidadesConfirmadas = {};
  this.carregamentoPacote = [];
  this.nomePedido = '';
}


confirmarPedido(): void {
  if (!this.pedidoAtual) return;

  const pacotes = this.pacotesSelecionados.map(p => ({
    pacote: p,
    quantidade: this.quantidadesSelecionadas[p.id!],
    confirmado: this.quantidadesConfirmadas[p.id!]
  }));

  this.pedidoAtual.pacotes = pacotes;
  this.pedidos.push(this.pedidoAtual);
  this.pedidoAtual = null;
}


  filtroCaminhao: string = '';

  get caminhoesFiltrados(): Caminhao[] {
    if (!this.filtroCaminhao.trim()) return this.caminhoes;
    const filtro = this.filtroCaminhao.toLowerCase();
    return this.caminhoes.filter(c =>
      c.nome.toLowerCase().includes(filtro) ||
      c.pesoLimite.toString().includes(filtro) ||
      `${c.comprimento}x${c.largura}x${c.altura}`.includes(filtro)
    );
  }

  filtroPacote: string = '';
  get pacotesFiltrados(): Pacote[] {
    if (!this.filtroPacote.trim()) return this.pacotes;
    const filtro = this.filtroPacote.toLowerCase();
    return this.pacotes.filter(p =>
      p.nome.toLowerCase().includes(filtro) ||
      p.peso.toString().includes(filtro) ||
      `${p.comprimento}x${p.largura}x${p.altura}`.includes(filtro)
    );
  }

}
