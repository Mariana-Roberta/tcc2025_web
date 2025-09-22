import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [
    NgIf,
    NgClass
  ],
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  temaAtual: 'light' | 'dark' = 'light';

  mostrarMenu = false;
  nomeUsuario: string = '';

  constructor(private router: Router, private authService: AuthService) {
    // Pega tema salvo no localStorage, se existir
    const salvo = localStorage.getItem('tema');
    if (salvo === 'dark') {
      this.temaAtual = 'dark';
      document.documentElement.classList.add('theme-dark');
    }
  }

  alternarTema() {
    if (this.temaAtual === 'light') {
      this.temaAtual = 'dark';
      document.documentElement.classList.add('theme-dark');
      localStorage.setItem('tema', 'dark');
    } else {
      this.temaAtual = 'light';
      document.documentElement.classList.remove('theme-dark');
      localStorage.setItem('tema', 'light');
    }
  }

  ngOnInit(): void {
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.nomeUsuario = usuario.razaoSocial || usuario.email;
    }
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  toggleMenu() {
    this.mostrarMenu = !this.mostrarMenu;
  }

  irParaPerfil() {
    this.router.navigate(['/perfil']);
    this.mostrarMenu = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  home() {
    this.router.navigate(['/home']);
  }

  otimizar() {
    this.router.navigate(['/otimiza']);
  }
}
