import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {NgForOf, NgIf} from "@angular/common";
import {Caminhao} from '../../model/caminhao.model';
import {Router} from '@angular/router';
import {ScreenBackgroundComponent} from '../../components/screen-background/screen-background.component';
import {CaminhaoService} from '../../services/caminhao.service';
import {AuthService} from '../../services/auth.service';
import {PacoteService} from '../../services/pacote.service';
import {Pacote} from '../../model/pacote.model';
import {FormsModule} from '@angular/forms';
import {CarregamentoPacote} from '../../model/carregamento-pacote.model';

@Component({
  selector: 'app-otimiza',
  imports: [
    NavbarComponent,
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

  constructor(private caminhaoService: CaminhaoService, private pacoteService: PacoteService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.carregarCaminhoes();
    this.carregarPacotes();
  }

  carregarCaminhoes() {
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.caminhaoService.listarPorUsuario(usuario.id).subscribe({
        next: (dados: Caminhao[]) => this.caminhoes = dados,
        error: (erro: any) => console.error('Erro ao carregar caminhões:', erro)
      });
    }
  }

  carregarPacotes() {
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.pacoteService.listarPorUsuario(usuario.id).subscribe({
        next: (dados: Pacote[]) => this.pacotes = dados,
        error: (erro: any) => console.error('Erro ao carregar caminhões:', erro)
      });
    }
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
    if (!this.caminhaoSelecionado || !this.todosPacotesConfirmados()) {
      console.warn('Caminhão ou pacotes não confirmados.');
      return;
    }

    const pacotesFormatados = this.pacotesSelecionados.map(pacote => ({
      id: pacote.id,
      nome: pacote.nome,
      comprimento: pacote.comprimento,
      largura: pacote.largura,
      altura: pacote.altura,
      peso: pacote.peso,
      quantidade: this.quantidadesSelecionadas[pacote.id!]
    }));

    const dados = {
      caminhao: this.caminhaoSelecionado,
      pacotes: pacotesFormatados
    };

    this.router.navigate(['/visualiza'], {
      state: { dados }
    });
  }


}
