import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import {LogoComponent} from '../../components/logo/logo.component';
import {ScreenBackgroundComponent} from '../../components/screen-background/screen-background.component';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { PopupService } from '../../services/popup.service';
import { PopupComponent } from '../../components/popup/popup.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FooterComponent, LogoComponent, ScreenBackgroundComponent, ReactiveFormsModule, PopupComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  mensagem: { mensagem: string, tipo: 'sucesso' | 'erro' } | null = null;

  loginForm: FormGroup;
  loginErro: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly popupService: PopupService
  ) {
    // Inicializa o formulário com validações
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  // Submissão do formulário
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    
    const { email, password } = this.loginForm.value;
    
    this.authService.login({ email, password }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('perfil', res.perfil); // caso venha o perfil
        this.router.navigate(['/home']);
      },
      error: () => {
        this.popupService.erro('Email ou senha inválidos.');
      }
    });
  }

  // Navega para tela de registro
  irParaRegistro(): void {
    this.router.navigate(['/cadastro']);
  }


}
