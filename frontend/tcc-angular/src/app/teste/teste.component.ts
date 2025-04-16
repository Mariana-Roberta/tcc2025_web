import { Component } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';
import {LogoComponent} from '../components/logo/logo.component';

@Component({
  selector: 'app-teste',
  imports: [
    NgOptimizedImage,
    LogoComponent
  ],
  templateUrl: './teste.component.html',
  styleUrl: './teste.component.css'
})
export class TesteComponent {

  constructor(private _router: Router) {
  }

  entrar() {
    this._router.navigate(['']);
  }
}
