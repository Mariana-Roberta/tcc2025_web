import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { CalculaComponent } from './pages/calcula/calcula.component';
import { VisualizaComponent } from './pages/visualiza/visualiza.component';
import { SobreComponent } from './pages/sobre/sobre.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'calcula', component: CalculaComponent },
    { path: 'visualiza', component: VisualizaComponent },
    { path: 'sobre', component: SobreComponent }
];
