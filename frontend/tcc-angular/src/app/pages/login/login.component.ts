import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import {LogoComponent} from '../../components/logo/logo.component';
import {ScreenBackgroundComponent} from '../../components/screen-background/screen-background.component';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FooterComponent, LogoComponent, ScreenBackgroundComponent, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  loginErro: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
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
        this.loginErro = 'Email ou senha inválidos.';
      }
    });
  }

  // Navega para tela de registro
  irParaRegistro(): void {
    this.router.navigate(['/cadastro']);
  }

}
