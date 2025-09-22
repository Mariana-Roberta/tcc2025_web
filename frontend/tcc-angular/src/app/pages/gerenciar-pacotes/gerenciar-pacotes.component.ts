import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ScreenBackgroundComponent } from '../../components/screen-background/screen-background.component';
import { AuthService } from '../../services/auth.service';
import { PacoteService } from '../../services/pacote.service';
import { Pacote } from '../../model/pacote.model';
import { PopupService } from '../../services/popup.service';
import { PopupComponent } from '../../components/popup/popup.component';
import { HttpErrorResponse } from '@angular/common/http';
import {Router} from '@angular/router';
import {CaminhaoService} from '../../services/caminhao.service';

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

  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly pacoteService = inject(PacoteService);
  private readonly authService = inject(AuthService);
  private readonly popupService = inject(PopupService);

  ngOnInit(): void {
    this.popupService.limpar();
    this.carregarPacotes();
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

  carregarPacotes() {
  const usuario = this.authService.getUsuario();
  if (usuario) {
    this.pacoteService.listarPorUsuario(usuario.id!).subscribe({
      next: (data: Pacote[]) => {
        console.log('[Pacotes] OK:', data);
        this.pacotes = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('[Pacotes] Falha ao carregar pacotes:', err);
        // tenta extrair mensagem útil do backend
        const msg =
          (err.error && (err.error.mensagem || err.error.message || err.error.error)) ||
          `${err.status} ${err.statusText}` ||
          'Erro ao carregar os pacotes.';
        this.popupService.erro(msg);
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

    this.novoPacote.usuario = { id: usuarioLogado.id! };

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

filtroPacote: string = '';

get pacotesFiltrados(): any[] {
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

get pacotesPaginados() {
  const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
  const fim = inicio + this.itensPorPagina;
  return this.pacotesFiltrados.slice(inicio, fim);
}


mudarPagina(pagina: number) {
  this.paginaAtual = pagina;
}

}
