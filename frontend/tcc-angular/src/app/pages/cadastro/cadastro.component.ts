import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import {Usuario} from '../../model/usuario.model';
import {FormsModule} from '@angular/forms';
import {UsuarioService} from '../../services/usuario.service';
import {ScreenBackgroundComponent} from '../../components/screen-background/screen-background.component';
import {LogoComponent} from '../../components/logo/logo.component';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-cadastro',
  imports: [FooterComponent, FormsModule, ScreenBackgroundComponent, LogoComponent],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  usuario: Usuario = {
    email: '',
    password: '',
    status: true,
    perfil: '',
    cnpj: '',
    razaoSocial: '',
    telefone: '',
  };

  constructor(private usuarioService: UsuarioService, private popupService: PopupService) {}

  salvar() {
    this.usuarioService.cadastrarUsuario(this.usuario).subscribe({
      next: (usuario) => {
        console.log('Usuário cadastrado com sucesso:', usuario);
        this.popupService.sucesso('Cadastro de usuário realizado com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao cadastrar:', err);
        this.popupService.erro('Erro ao realizar o cadastro.');
      }
    });

  }

  formatarCnpj(event: any): void {
  let v = event.target.value.replace(/\D/g, ''); // remove tudo que não é número
  if (v.length > 14) v = v.slice(0, 14);

  v = v.replace(/^(\d{2})(\d)/, '$1.$2');        // 00.
  v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');  // 00.000.
  v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');     // 00.000.000/
  v = v.replace(/(\d{4})(\d)/, '$1-$2');         // 00.000.000/0000-00

  event.target.value = v;
}

formatarTelefone(event: any): void {
  let v = event.target.value.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);

  if (v.length <= 10) {
    // formato (00) 0000-0000
    v = v.replace(/^(\d{2})(\d)/, '($1) $2');
    v = v.replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    // formato (00) 00000-0000 para celular
    v = v.replace(/^(\d{2})(\d)/, '($1) $2');
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
  }

  event.target.value = v;
}
}
