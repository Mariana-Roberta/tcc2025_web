import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ScreenBackgroundComponent } from '../../components/screen-background/screen-background.component';
import { AuthService } from '../../services/auth.service';
import { PacoteService } from '../../services/pacote.service';
import { Pacote } from '../../model/pacote.model';
import { PopupService } from '../../services/popup.service';
import { PopupComponent } from '../../components/popup/popup.component';

@Component({
  selector: 'app-gerenciar-pacotes',
  templateUrl: './gerenciar-pacotes.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    ScreenBackgroundComponent,
    PopupComponent
  ],
  styleUrls: ['./gerenciar-pacotes.component.css']
})
export class GerenciarPacotesComponent implements OnInit {

  pacotes: Pacote[] = [];

  novoPacote: Pacote = {
    nome: '',
    comprimento: 0,
    largura: 0,
    altura: 0,
    peso: 0,
    fragil: false,
    rotacao: false,
    usuario: { id: 0 }
  };

  mostrarFormulario = false;
  modoEdicao = false;
  indiceEdicao: number | null = null;
  campoFocado: string | null = null; // para uso no HTML caso deseje controle de foco

  constructor(
    private pacoteService: PacoteService,
    private authService: AuthService,
    private popupService: PopupService
  ) {}

  ngOnInit(): void {
    this.popupService.limpar();
    this.carregarPacotes();
  }

  carregarPacotes() {
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.pacoteService.listarPorUsuario(usuario.id).subscribe({
        next: (data: Pacote[]) => {
          this.pacotes = data;
        },
        error: () => {
          this.popupService.erro('Erro ao carregar os pacotes.');
        }
      });
    } else {
      this.popupService.erro('Usuário não autenticado.');
    }
  }

  exibirFormulario() {
    this.resetarFormulario();
    this.mostrarFormulario = true;
    this.modoEdicao = false;
    this.indiceEdicao = null;
  }

  cancelar() {
    this.resetarFormulario();
    this.mostrarFormulario = false;
  }

  private resetarFormulario() {
    this.novoPacote = {
      nome: '',
      comprimento: 0,
      largura: 0,
      altura: 0,
      peso: 0,
      fragil: false,
      rotacao: false,
      usuario: { id: 0 }
    };
    this.modoEdicao = false;
    this.indiceEdicao = null;
  }

  verificarFormulario(form: any): void {
    if (form.invalid) {
      this.popupService.erro('Por favor, verifique os campos obrigatórios e tente novamente.');
      return;
    }

    this.adicionarOuEditarPacote();
  }

  adicionarOuEditarPacote() {
    const usuarioLogado = this.authService.getUsuario();
    if (!usuarioLogado) {
      this.popupService.erro('Usuário não autenticado.');
      return;
    }

    this.novoPacote.usuario = { id: usuarioLogado.id };

    if (this.modoEdicao && this.indiceEdicao !== null) {
      this.pacoteService.atualizar(this.novoPacote.id!, this.novoPacote).subscribe({
        next: () => {
          this.popupService.sucesso('Pacote atualizado com sucesso!');
          this.carregarPacotes();
          this.cancelar();
        },
        error: () => {
          this.popupService.erro('Erro ao atualizar o pacote.');
        }
      });
    } else {
      this.pacoteService.salvar(this.novoPacote).subscribe({
        next: () => {
          this.popupService.sucesso('Pacote salvo com sucesso!');
          this.carregarPacotes();
          this.cancelar();
        },
        error: () => {
          this.popupService.erro('Erro ao salvar o pacote.');
        }
      });
    }
  }

  editarPacote(pacote: Pacote, index: number) {
    this.mostrarFormulario = true;
    this.modoEdicao = true;
    this.indiceEdicao = index;
    this.novoPacote = { ...pacote };
  }

  excluirPacote(pacote: Pacote) {
    this.pacoteService.excluir(pacote.id!).subscribe({
      next: () => {
        this.popupService.sucesso('Pacote excluído com sucesso!');
        this.carregarPacotes();
      },
      error: () => {
        this.popupService.erro('Erro ao excluir o pacote.');
      }
    });
  }

  paginaAtual: number = 1;
itensPorPagina: number = 5;

get totalPaginas(): number {
  return Math.ceil(this.pacotes.length / this.itensPorPagina);
}

get pacotesPaginados() {
  const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
  const fim = inicio + this.itensPorPagina;
  return this.pacotes.slice(inicio, fim);
}

mudarPagina(pagina: number) {
  this.paginaAtual = pagina;
}

}
