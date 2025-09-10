import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import {Usuario} from '../../model/usuario.model';
import {FormsModule} from '@angular/forms';
import {UsuarioService} from '../../services/usuario.service';
import {ScreenBackgroundComponent} from '../../components/screen-background/screen-background.component';
import {LogoComponent} from '../../components/logo/logo.component';
import { PopupService } from '../../services/popup.service';
import { PopupComponent } from '../../components/popup/popup.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  imports: [FooterComponent, FormsModule, ScreenBackgroundComponent, LogoComponent, PopupComponent],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  usuario: Usuario = {
    email: '',
    password: '',
    status: true,
    perfil: 'CLIENTE',
    cnpj: '',
    razaoSocial: '',
    telefone: '',
  };

  constructor(private usuarioService: UsuarioService, private popupService: PopupService, private router: Router) {}

  private formatarTelefoneParaEnvio(tel: string): string {
  const d = (tel || '').replace(/\D/g, '').slice(0, 11);
  if (d.length === 10) {
    // fixo
    return d.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }
  if (d.length === 11) {
    // celular
    return d.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }
  return tel; // deixa como veio; backend validará e retornará erro
}

salvar() {
  const usuarioLimpo: Usuario = {
    ...this.usuario,
    cnpj: this.usuario.cnpj.replace(/\D/g, ''),
    telefone: this.formatarTelefoneParaEnvio(this.usuario.telefone), // ✅ garante padrão
  };

  this.usuarioService.cadastrarUsuario(usuarioLimpo).subscribe({
    next: (usuario) => {
      console.log('Usuário cadastrado com sucesso:', usuario);
      this.popupService.sucesso('Cadastro de usuário realizado com sucesso!');
    },
    error: (err) => {
      const mensagem = err.error?.mensagem || err.message;
      this.popupService.erro(mensagem);
    }
  });
}


  voltar () {
    this.router.navigate(['/login']);
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
  let v = String(event.target.value || '').replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);

  let formatado: string;
  if (v.length <= 10) {
    // (00) 0000-0000
    formatado = v
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  } else {
    // (00) 00000-0000
    formatado = v
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
  }

  event.target.value = formatado;
  this.usuario.telefone = formatado; // ✅ atualiza o modelo
}

}
