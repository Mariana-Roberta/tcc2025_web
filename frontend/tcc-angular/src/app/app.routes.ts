import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { VisualizaComponent } from './pages/visualiza/visualiza.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import {GerenciarProdutosComponent} from './pages/gerenciar-produtos/gerenciar-produtos.component';
import {GerenciarCaminhoesComponent} from './pages/gerenciar-caminhoes/gerenciar-caminhoes.component';
import {OtimizaComponent} from './pages/otimiza/otimiza.component';
import {ContatoComponent} from './pages/contato/contato.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'cadastro', component: CadastroComponent },
    { path: 'home', component: HomeComponent },
    { path: 'gerenciar-produtos', component: GerenciarProdutosComponent },
    { path: 'gerenciar-caminhoes', component: GerenciarCaminhoesComponent },
    { path: 'otimiza', component: OtimizaComponent },
    { path: 'visualiza', component: VisualizaComponent },
    { path: 'perfil', component: PerfilComponent },
    { path: 'contato', component: ContatoComponent },

];
