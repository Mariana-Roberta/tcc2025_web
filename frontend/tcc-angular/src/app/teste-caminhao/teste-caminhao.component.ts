import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-teste-caminhao',
  imports: [
    FormsModule
  ],
  templateUrl: './teste-caminhao.component.html',
  styleUrl: './teste-caminhao.component.css'
})
export class TesteCaminhaoComponent {
  caminhao = {
    nome: '',
    placa: '',
    capacidade: 0,
    comprimento: 0,
    largura: 0,
    altura: 0
  };

  cadastrarCaminhao() {
    console.log('Caminhão cadastrado:', this.caminhao);
    // aqui você pode chamar um serviço para salvar no backend
  }
}
