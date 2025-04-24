import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ScreenBackgroundComponent } from '../../components/screen-background/screen-background.component';
import { CaminhaoService } from '../../services/caminhao.service';
import { AuthService } from '../../services/auth.service';
import {PacoteService} from '../../services/pacote.service';
import {Pacote} from '../../model/pacote.model';

@Component({
  selector: 'app-gerenciar-pacotes',
  templateUrl: './gerenciar-pacotes.component.html',
  standalone: true,
  imports: [NgForOf, FormsModule, NgIf, NavbarComponent, ScreenBackgroundComponent],
  styleUrls: ['./gerenciar-pacotes.component.css']
})
export class GerenciarPacotesComponent implements OnInit {

  pacotes: any[] = [];

  novoPacote: any = {
    nome: '',
    comprimento: null,
    largura: null,
    altura: null,
    peso: null
  };

  mostrarFormulario = false;
  modoEdicao = false;
  indiceEdicao: number | null = null;

  constructor(
    private pacoteService: PacoteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.pacoteService.listarPorUsuario(usuario.id).subscribe({
        next: (data: Pacote[]) => {
          this.pacotes = data;
        },
        error: (err: any) => console.error('Erro ao buscar pacotes', err)
      });
    }
  }

  exibirFormulario() {
    this.novoPacote = {
      nome: '',
      comprimento: null,
      largura: null,
      altura: null,
      peso: null,
    };
    this.mostrarFormulario = true;
    this.modoEdicao = false;
    this.indiceEdicao = null;
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.novoPacote = {
      nome: '',
      comprimento: null,
      largura: null,
      altura: null,
      peso: null,
    };
    this.modoEdicao = false;
    this.indiceEdicao = null;
  }

  adicionarOuEditarPacote() {
    const usuario = this.authService.getUsuario();
    if (!usuario) return;

    const pacote = {
      ...this.novoPacote,
      usuario: { id: usuario.id }
    };

    this.pacoteService.salvar(pacote).subscribe({
      next: data => {
        this.pacotes.push(data);
        this.cancelar();
      },
      error: err => console.error('Erro ao salvar pacote', err)
    });
  }

  editarPacote(pacote: any, index: number) {
    this.novoPacote = {
      nome: pacote.nome,
      comprimento: pacote.comprimento,
      largura: pacote.largura,
      altura: pacote.altura,
      peso: pacote.peso,
    };
    this.mostrarFormulario = true;
    this.modoEdicao = true;
    this.indiceEdicao = index;
  }

  excluirPacote(pacote: any) {
    this.pacotes = this.pacotes.filter(p => p !== pacote);
  }
}
