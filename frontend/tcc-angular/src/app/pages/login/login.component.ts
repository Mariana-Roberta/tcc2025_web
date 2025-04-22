import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import {LogoComponent} from '../../components/logo/logo.component';
import {ScreenBackgroundComponent} from '../../components/screen-background/screen-background.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FooterComponent, LogoComponent, ScreenBackgroundComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
