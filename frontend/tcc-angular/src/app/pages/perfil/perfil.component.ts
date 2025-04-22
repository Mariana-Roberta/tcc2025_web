import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import {FooterComponent} from '../../components/footer/footer.component';
import {ScreenBackgroundComponent} from '../../components/screen-background/screen-background.component';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Usuario} from '../../model/usuario.model';

@Component({
  selector: 'app-perfil',
  imports: [NavbarComponent, FooterComponent, ScreenBackgroundComponent, NgIf, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  modoAtual: 'perfil' | 'editar' | 'senha' = 'perfil';

  usuario: Usuario = {
    cnpj: '09.530.778/0001-01',
    razaoSocial: 'Transporte Rápido LTDA',
    telefone: '(11) 91234-5678',
    email: 'joao@empresa.com.br',
    password: '123'
  };

  constructor(private router: Router) {}

  cancelar() {
    this.modoAtual = 'perfil';
  }

  salvarEdicao() {
    // Aqui você pode chamar um serviço de backend
    alert('Dados atualizados com sucesso!');
    this.modoAtual = 'perfil';
  }

  salvarSenha() {
    alert('Senha alterada com sucesso!');
    this.modoAtual = 'perfil';
  }

  sairConta() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
