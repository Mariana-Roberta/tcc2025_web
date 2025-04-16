import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import {LogoComponent} from '../../components/logo/logo.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FooterComponent, LogoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
