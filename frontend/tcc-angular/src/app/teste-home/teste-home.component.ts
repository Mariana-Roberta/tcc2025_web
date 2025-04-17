import { Component } from '@angular/core';
import {ScreenBackgroundComponent} from '../components/screen-background/screen-background.component';
import {NavbarComponent} from '../components/navbar/navbar.component';

@Component({
  selector: 'app-teste-home',
  imports: [
    ScreenBackgroundComponent,
    NavbarComponent
  ],
  templateUrl: './teste-home.component.html',
  styleUrl: './teste-home.component.css'
})
export class TesteHomeComponent {

}
