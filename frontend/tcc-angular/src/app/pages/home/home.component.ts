import {Component, OnInit} from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import {Router} from '@angular/router';
import {ScreenBackgroundComponent} from "../../components/screen-background/screen-background.component";
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-home',
    imports: [NavbarComponent, ScreenBackgroundComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  nomeUsuario: string = '';

  constructor(private _router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.nomeUsuario = usuario.razaoSocial || usuario.email;
    }
  }

  gerenciarCaminhoes() {
    this._router.navigate(['/gerenciar-caminhoes']);
  }

  gerenciarPacotes() {
    this._router.navigate(['/gerenciar-pacotes']);
  }

  otimizar() {
    this._router.navigate(['/otimiza']);
  }
}
