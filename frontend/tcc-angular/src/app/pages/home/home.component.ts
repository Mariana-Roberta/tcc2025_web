import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import {Router} from '@angular/router';
import {ScreenBackgroundComponent} from "../../components/screen-background/screen-background.component";

@Component({
  selector: 'app-home',
    imports: [NavbarComponent, ScreenBackgroundComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private _router: Router) {
  }

  gerenciarCaminhoes() {
    this._router.navigate(['/gerenciar-caminhoes']);
  }

  gerenciarProdutos() {
    this._router.navigate(['/gerenciar-produtos']);
  }

  otimizar() {
    this._router.navigate(['/otimiza']);
  }
}
