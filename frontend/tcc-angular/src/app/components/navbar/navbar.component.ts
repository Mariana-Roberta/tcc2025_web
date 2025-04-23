import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  mostrarMenu = false;
  nomeUsuario: string = '';

  constructor(private router: Router, private authService: AuthService) {}

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
