import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { NgIf, NgForOf } from '@angular/common';
import { ThreeDViewComponent } from '../three-d-view/three-d-view.component';
import { OtimizarService } from '../../services/otimizar.service';

@Component({
  selector: 'app-visualiza',
  standalone: true,
  imports: [
    NavbarComponent,
    NgIf,
    NgForOf,
    ThreeDViewComponent
  ],
  templateUrl: './visualiza.component.html',
  styleUrl: './visualiza.component.css'
})
export class VisualizaComponent {
  caminhao: any;
  pacotes: any[] = [];
  pacotesRecebidos: any[] = [];

  pacoteIds: number[] = [];
  pacoteAtualId: number = 0;
  pacotesParaMostrar: any[] = [];

  loading = true;

  constructor(private router: Router, private otimizarService: OtimizarService) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { dados: any };

    if (state?.dados) {
      this.caminhao = state.dados.caminhao;
      this.pacotes = state.dados.pacotes;
      this.pacotesRecebidos = state.dados.pacotes;
      console.log(this.pacotes)
      this.enviarParaOtimizar(state.dados.caminhao, state.dados.pacotes);
    }
  }

  enviarParaOtimizar(caminhao: any, pacotes: any[]): void {
    const body = {
      caminhao: {
        comprimento: caminhao.comprimento,
        largura: caminhao.largura,
        altura: caminhao.altura,
        pesoLimite: caminhao.pesoLimite
      },
      pacotes: pacotes.map(p => ({
        id: p.id,
        comprimento: p.comprimento,
        largura: p.largura,
        altura: p.altura,
        peso: p.peso,
        quantidade: p.quantidade
      }))
    };
console.log("ENVIANDO")
    this.otimizarService.otimizar(body).subscribe({
      next: (dados) => {
        console.log("RECBIDO")
        this.pacotes = dados.map(d => ({
          x: d.x,
          y: d.y,
          z: d.z,
          comprimento: d.comprimento,
          largura: d.largura,
          altura: d.altura,
          cor: d.pacoteId
        }));
        console.log("DADOS DO BACKEND:", JSON.stringify(this.pacotes, null, 2));

        this.pacoteIds = [...new Set(this.pacotes.map(p => p.cor))];
        this.pacoteAtualId = this.pacoteIds[0];

        this.atualizarPacotesParaMostrar();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao otimizar pacotes:', err);
        this.loading = false;
      }
    });
  }

  atualizarPacotesParaMostrar(): void {
    console.log("ATUALIZAR")
    this.pacotesParaMostrar = this.pacotes.filter(p => p.cor === this.pacoteAtualId);
  }

  avancarPasso(): void {
    const indexAtual = this.pacoteIds.indexOf(this.pacoteAtualId);
    if (indexAtual < this.pacoteIds.length - 1) {
      this.pacoteAtualId = this.pacoteIds[indexAtual + 1];
      this.atualizarPacotesParaMostrar();
    }
  }

  voltarPasso(): void {
    const indexAtual = this.pacoteIds.indexOf(this.pacoteAtualId);
    if (indexAtual > 0) {
      this.pacoteAtualId = this.pacoteIds[indexAtual - 1];
      this.atualizarPacotesParaMostrar();
    }
  }

  confirmar(): void {
    alert('Todos os pacotes carregados e confirmados!');
  }
}
