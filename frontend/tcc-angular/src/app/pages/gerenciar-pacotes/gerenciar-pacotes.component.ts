import { Component, OnInit } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ScreenBackgroundComponent } from '../../components/screen-background/screen-background.component';
import { CaminhaoService } from '../../services/caminhao.service';
import { AuthService } from '../../services/auth.service';
import {PacoteService} from '../../services/pacote.service';
import {Pacote} from '../../model/pacote.model';
import {Caminhao} from '../../model/caminhao.model';

@Component({
  selector: 'app-gerenciar-pacotes',
  templateUrl: './gerenciar-pacotes.component.html',
  standalone: true,
  imports: [NgForOf, NgClass, FormsModule, NgIf, NavbarComponent, ScreenBackgroundComponent],
  styleUrls: ['./gerenciar-pacotes.component.css']
})
export class GerenciarPacotesComponent implements OnInit {

  pacotes: any[] = [];

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

  constructor(
    private pacoteService: PacoteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarPacotes();
  }

  carregarPacotes() {
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.pacoteService.listarPorUsuario(usuario.id).subscribe({
        next: (data: Pacote[]) => {
          this.pacotes = data;
          console.log(data);
        },
        error: (err: any) => console.error('Erro ao buscar pacotes', err)
      });
    }
  }

  exibirFormulario() {
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
    this.mostrarFormulario = true;
    this.modoEdicao = false;
    this.indiceEdicao = null;
  }

  cancelar() {
    this.mostrarFormulario = false;
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

  adicionarOuEditarPacote() {
    const usuarioLogado = this.authService.getUsuario();
    if (!usuarioLogado) {
      console.error('Usuário não logado');
      return;
    }

    // Garante o vínculo do pacote com o usuário logado
    this.novoPacote.usuario = { id: usuarioLogado.id };

        console.log(this.novoPacote.id )
    if (this.modoEdicao && this.indiceEdicao !== null) {
        console.log(this.modoEdicao)
      this.pacoteService.atualizar(this.novoPacote.id!, this.novoPacote).subscribe(() => {
        console.log("editar")
        this.carregarPacotes();
        this.cancelar();
      });
    } else {
        console.log(this.modoEdicao)
        console.log(this.novoPacote)
        console.log("salvar")
      this.pacoteService.salvar(this.novoPacote).subscribe(() => {
        this.carregarPacotes();
        this.cancelar();
      });
    }
  }

  editarPacote(pacote: Pacote, index: number) {
    this.mostrarFormulario = true;
    this.modoEdicao = true;
    this.indiceEdicao = index;
    this.novoPacote = { ...pacote };
  }

  excluirPacote(pacote: any) {
    this.pacotes = this.pacotes.filter(p => p !== pacote);
  }

}
