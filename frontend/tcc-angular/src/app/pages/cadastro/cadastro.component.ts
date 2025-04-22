import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import {Usuario} from '../../model/usuario.model';
import {FormsModule} from '@angular/forms';
import {UsuarioService} from '../../services/usuario.service';
import {ScreenBackgroundComponent} from '../../components/screen-background/screen-background.component';
import {LogoComponent} from '../../components/logo/logo.component';

@Component({
  selector: 'app-cadastro',
  imports: [FooterComponent, FormsModule, ScreenBackgroundComponent, LogoComponent],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  usuario: Usuario = {
    cnpj: '09.530.778/0001-01',
    razaoSocial: 'Transporte Rápido LTDA',
    telefone: '(11) 91234-5678',
    email: 'joao@empresa.com.br',
    password: '123'
  };

  constructor(private usuarioService: UsuarioService) {}

  salvar() {

    console.log(this.usuario)
    this.usuarioService.cadastrarUsuario(this.usuario).subscribe({
      next: (usuario) => {
        console.log('Usuário cadastrado com sucesso:', usuario);
        alert('Cadastro de usuário realizado com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao cadastrar:', err);
        alert('Erro ao realizar o cadastro.');
      }
    });

  }
}
