import {Caminhao} from '../../model/caminhao.model';
import {CaminhaoService} from '../../services/caminhao.service';
import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormsModule} from '@angular/forms';
import {NavbarComponent} from '../../components/navbar/navbar.component';
import {NgForOf, NgIf} from '@angular/common';
import {ScreenBackgroundComponent} from '../../components/screen-background/screen-background.component';

@Component({
  selector: 'app-gerenciar-caminhoes',
  standalone: true,
  imports: [
    FormsModule,
    NavbarComponent,
    NgForOf,
    NgIf,
    ScreenBackgroundComponent
  ],
  templateUrl: './gerenciar-caminhoes.component.html',
  styleUrls: ['./gerenciar-caminhoes.component.css']
})

export class GerenciarCaminhoesComponent implements OnInit{
  caminhoes: Caminhao[] = [];

  mostrarFormulario = false;
  modoEdicao = false;
  indiceEdicao: number | null = null;

  novoCaminhao: Caminhao = {
    nome: '',
    comprimento: 0,
    largura: 0,
    altura: 0,
    pesoLimite: 0,
    usuario: { id: 0 } // Ajuste isso para o usuário logado
  };

  constructor(private caminhaoService: CaminhaoService, private authService: AuthService) {}

  ngOnInit() {
    this.carregarCaminhoes();
  }

  carregarCaminhoes() {
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.caminhaoService.listarPorUsuario(usuario.id).subscribe({
        next: (dados: Caminhao[]) => this.caminhoes = dados,
        error: (erro: any) => console.error('Erro ao carregar caminhões:', erro)
      });
      console.log(this.caminhoes)
    }
  }

  exibirFormulario() {
    this.mostrarFormulario = true;
    this.modoEdicao = false;
    this.novoCaminhao = { nome: '', comprimento: 0, largura: 0, altura: 0, pesoLimite: 0, usuario: { id: 0 } };
  }

  editarCaminhao(caminhao: Caminhao, index: number) {
    this.mostrarFormulario = true;
    this.modoEdicao = true;
    this.indiceEdicao = index;
    this.novoCaminhao = { ...caminhao };
  }

  cancelarAdicao() {
    this.mostrarFormulario = false;
    this.novoCaminhao = { nome: '', comprimento: 0, largura: 0, altura: 0, pesoLimite: 0, usuario: { id: 0 } };
    this.modoEdicao = false;
    this.indiceEdicao = null;
  }

  adicionarOuEditarCaminhao() {
    const usuarioLogado = this.authService.getUsuario();
    if (!usuarioLogado) {
      console.error('Usuário não logado');
      return;
    }

    // Garante o vínculo do caminhão com o usuário logado
    this.novoCaminhao.usuario = { id: usuarioLogado.id };

    if (this.modoEdicao && this.indiceEdicao !== null) {
      this.caminhaoService.atualizar(this.novoCaminhao.id!, this.novoCaminhao).subscribe(() => {
        this.carregarCaminhoes();
        this.cancelarAdicao();
      });
    } else {
      this.caminhaoService.salvar(this.novoCaminhao).subscribe(() => {
        this.carregarCaminhoes();
        this.cancelarAdicao();
      });
    }
  }


  excluirCaminhao(caminhao: Caminhao) {
    this.caminhaoService.excluir(caminhao.id!).subscribe(() => {
      this.carregarCaminhoes();
    });
  }

  // Paginação
  itensPorPagina = 5;
  paginaAtual = 1;

  get caminhoesPaginados() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.caminhoes.slice(inicio, fim);
  }

  get totalPaginas() {
    return Math.ceil(this.caminhoes.length / this.itensPorPagina);
  }

  mudarPagina(pagina: number) {
    this.paginaAtual = pagina;
  }
}
