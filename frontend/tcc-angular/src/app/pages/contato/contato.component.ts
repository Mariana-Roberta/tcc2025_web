import { Component } from '@angular/core';
import {NavbarComponent} from '../../components/navbar/navbar.component';
import {FooterComponent} from '../../components/footer/footer.component';
import {ScreenBackgroundComponent} from '../../components/screen-background/screen-background.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-contato',
  imports: [
    NavbarComponent,
    FooterComponent,
    ScreenBackgroundComponent,
    NgForOf
  ],
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.css'
})
export class ContatoComponent {
  desenvolvedores = [
    {
      nome: 'Mariana Roberta da Silva Leandro',
      email: 'marianaroberta.240@email.com',
      github: 'https://github.com/Mariana-Roberta'
    },
    {
      nome: 'Ottony Kazumi Andrade',
      email: 'ottony.k@email.com',
      github: 'https://github.com/'
    },
    {
      nome: 'Paulo Vitor de Araujo Rocha',
      email: 'dr.pvrocha@email.com',
      github: 'https://github.com/'
    }
  ];
}

