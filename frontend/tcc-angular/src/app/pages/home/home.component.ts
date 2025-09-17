import {Component, OnInit} from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import {Router} from '@angular/router';
import {ScreenBackgroundComponent} from "../../components/screen-background/screen-background.component";
import {AuthService} from '../../services/auth.service';
import { PopupService } from '../../services/popup.service';
import { PopupComponent } from '../../components/popup/popup.component';

@Component({
  selector: 'app-home',
    imports: [NavbarComponent, ScreenBackgroundComponent, PopupComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  nomeUsuario: string = '';

  constructor(private readonly _router: Router, 
    private readonly authService: AuthService, 
    private readonly popupService: PopupService
  ) {}

  ngOnInit(): void {
    this.popupService.limpar();
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

  gerenciarCarregamentos() {
    this._router.navigate(['/gerenciar-carregamentos']);
  }

  otimizar() {
    this._router.navigate(['/otimiza']);
  }
}
