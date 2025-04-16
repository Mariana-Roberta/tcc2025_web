import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private _router: Router) {
  }

  cadastroCaminhao() {
    this._router.navigate(['/cadastro-caminhao']);
  }

  cadastroProdutos() {
    this._router.navigate(['/cadastro-produtos']);
  }

  realizaOtimizacao(){
    this._router.navigate(['/realiza-otimizacao']);
  }
}
