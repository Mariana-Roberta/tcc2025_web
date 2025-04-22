import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private _router: Router) {
  }

  home() {
    this._router.navigate(['/home']);
  }

  otimizar() {
    this._router.navigate(['/otimiza']);
  }
}

