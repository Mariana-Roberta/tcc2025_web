import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [NgClass],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  temaAtual: 'light' | 'dark' = 'light';

  constructor(private router: Router) {
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

  
  irParaContato(): void {
    this.router.navigate(['/contato']);
  }
}
