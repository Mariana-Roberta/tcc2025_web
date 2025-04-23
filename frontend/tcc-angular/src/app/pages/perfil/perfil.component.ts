import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../model/usuario.model';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ScreenBackgroundComponent } from '../../components/screen-background/screen-background.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, ScreenBackgroundComponent, NgIf, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  modoAtual: 'perfil' | 'editar' | 'senha' = 'perfil';

  usuario: Usuario = {
    cnpj: '',
    razaoSocial: '',
    telefone: '',
    email: '',
    password: ''
  };

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const usuarioLogado = this.authService.getUsuario();
    if (usuarioLogado) {
      this.usuario = { ...usuarioLogado };
    } else {
      // Se não tiver usuário logado, redireciona
      this.router.navigate(['/login']);
    }
  }

  cancelar() {
    this.modoAtual = 'perfil';
    this.ngOnInit(); // restaura dados anteriores
  }

  salvarEdicao() {
    // Aqui você poderia enviar os dados atualizados ao backend
    this.authService.setUsuario(this.usuario); // atualiza no localStorage
    alert('Dados atualizados com sucesso!');
    this.modoAtual = 'perfil';
  }

  salvarSenha() {
    // Aqui você poderia chamar um endpoint para alteração de senha
    alert('Senha alterada com sucesso!');
    this.modoAtual = 'perfil';
  }

  sairConta() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
