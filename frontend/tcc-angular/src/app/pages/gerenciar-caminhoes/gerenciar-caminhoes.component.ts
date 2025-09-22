import {Component, inject, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ScreenBackgroundComponent } from '../../components/screen-background/screen-background.component';
import { CaminhaoService } from '../../services/caminhao.service';
import { AuthService } from '../../services/auth.service';
import { Caminhao } from '../../model/caminhao.model';
import { PopupService } from '../../services/popup.service';
import { PopupComponent } from '../../components/popup/popup.component';
import {Router} from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-gerenciar-caminhoes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    ScreenBackgroundComponent,
    PopupComponent
  ],
  templateUrl: './gerenciar-caminhoes.component.html',
  styleUrls: ['./gerenciar-caminhoes.component.css']
})
export class GerenciarCaminhoesComponent implements OnInit {

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
    usuario: { id: 0 }
  };

  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly caminhaoService = inject(CaminhaoService);
  private readonly authService = inject(AuthService);
  private readonly popupService = inject(PopupService);

  ngOnInit(): void {
    this.popupService.limpar();
    this.carregarCaminhoes();
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

  carregarCaminhoes(): void {
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.caminhaoService.listarPorUsuario(usuario.id!).subscribe({
        next: (dados: Caminhao[]) => {
          this.caminhoes = dados;
        },
        error: () => {
          this.popupService.erro('Erro ao carregar os caminhões.');
        }
      });
    } else {
      this.popupService.erro('Usuário não autenticado.');
    }
  }

  exibirFormulario(): void {
    this.resetarFormulario();
    this.mostrarFormulario = true;
  }

  editarCaminhao(caminhao: Caminhao, index: number): void {
    this.mostrarFormulario = true;
    this.modoEdicao = true;
    this.indiceEdicao = index;
    this.novoCaminhao = { ...caminhao };
  }

  cancelarAdicao(): void {
    this.resetarFormulario();
    this.mostrarFormulario = false;
  }

  private resetarFormulario(): void {
    this.novoCaminhao = {
      nome: '',
      comprimento: 0,
      largura: 0,
      altura: 0,
      pesoLimite: 0,
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

  this.adicionarOuEditarCaminhao();
}


  adicionarOuEditarCaminhao(): void {
    const usuarioLogado = this.authService.getUsuario();
    if (!usuarioLogado) {
      this.popupService.erro('Usuário não autenticado.');
      return;
    }

    this.novoCaminhao.usuario = { id: usuarioLogado.id! };

    if (this.modoEdicao && this.indiceEdicao !== null) {
      this.caminhaoService.atualizar(this.novoCaminhao.id!, this.novoCaminhao).subscribe({
        next: () => {
          this.popupService.sucesso('Caminhão atualizado com sucesso!');
          this.carregarCaminhoes();
          this.cancelarAdicao();
        },
        error: () => {
          this.popupService.erro('Erro ao atualizar caminhão.');
        }
      });
    } else {
      this.caminhaoService.salvar(this.novoCaminhao).subscribe({
        next: () => {
          this.popupService.sucesso('Caminhão salvo com sucesso!');
          this.carregarCaminhoes();
          this.cancelarAdicao();
        },
        error: () => {
          this.popupService.erro('Erro ao salvar caminhão.');
        }
      });
    }
  }

  excluirCaminhao(caminhao: Caminhao): void {
    this.caminhaoService.excluir(caminhao.id!).subscribe({
      next: () => {
        this.popupService.sucesso('Caminhão excluído com sucesso!');
        this.carregarCaminhoes();
      },
      error: () => {
        this.popupService.erro('Erro ao excluir caminhão.');
      }
    });
  }

  // Paginação
  itensPorPagina = 5;
  paginaAtual = 1;

  filtroCaminhao: string = '';

get caminhoesFiltrados(): any[] {
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

get caminhoesPaginados(): any[] {
  const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
  const fim = inicio + this.itensPorPagina;
  return this.caminhoesFiltrados.slice(inicio, fim);
}


  get totalPaginas(): number {
    return Math.ceil(this.caminhoes.length / this.itensPorPagina);
  }

  mudarPagina(pagina: number): void {
    this.paginaAtual = pagina;
  }

  campoFocado: string | null = null;

}
