import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import {Pessoa} from '../../model/pessoa.model';
import {Usuario} from '../../model/usuario.model';
import {FormsModule} from '@angular/forms';
import {UsuarioService} from '../../services/usuario.service';
import {setMaxIdleHTTPParsers} from 'node:http';

@Component({
  selector: 'app-cadastro',
  imports: [FooterComponent, FormsModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  pessoa: Pessoa = {
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    telefone: ''
  };

  usuario: Usuario = {
    email: '',
    password: '',
    status: true,
    perfil: 'CLIENTE', // valor inicial
    idPessoa: 0 // será preenchido após cadastro de Pessoa
  };

  constructor(private usuarioService: UsuarioService) {}

  salvar() {

      this.usuario.idPessoa = 10;

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
