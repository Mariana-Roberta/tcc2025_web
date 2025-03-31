import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { CalculaComponent } from './pages/calcula/calcula.component';
import { VisualizaComponent } from './pages/visualiza/visualiza.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { CadastroCaminhaoComponent } from './pages/cadastro-caminhao/cadastro-caminhao.component';
import { CadastroProdutosComponent } from './pages/cadastro-produtos/cadastro-produtos.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'cadastro', component: CadastroComponent },
    { path: 'home', component: HomeComponent },
    { path: 'perfil', component: PerfilComponent },
    { path: 'cadastro-caminhao', component: CadastroCaminhaoComponent },
    { path: 'cadastro-produtos', component: CadastroProdutosComponent },
    { path: 'calcula', component: CalculaComponent },
    { path: 'visualiza', component: VisualizaComponent },
    { path: 'sobre', component: SobreComponent },
];
