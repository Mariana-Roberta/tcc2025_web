import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { VisualizaComponent } from './pages/visualiza/visualiza.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { GerenciarPacotesComponent } from './pages/gerenciar-pacotes/gerenciar-pacotes.component';
import { GerenciarCaminhoesComponent } from './pages/gerenciar-caminhoes/gerenciar-caminhoes.component';
import { OtimizaComponent } from './pages/otimiza/otimiza.component';
import { ContatoComponent } from './pages/contato/contato.component';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // redirecionamento padrão
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },

  // protegidas por autenticação
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'gerenciar-pacotes', component: GerenciarPacotesComponent},
  { path: 'gerenciar-caminhoes', component: GerenciarCaminhoesComponent, canActivate: [AuthGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  { path: 'visualiza', component: VisualizaComponent },
  { path: 'otimiza', component: OtimizaComponent },
  { path: 'contato', component: ContatoComponent, canActivate: [AuthGuard] },

  // rota fallback para erro 404
  { path: '**', redirectTo: 'login' }
];
