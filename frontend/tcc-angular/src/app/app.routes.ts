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
import {RealizaOtimizacaoComponent} from './pages/realiza-otimizacao/realiza-otimizacao.component';
import {TesteComponent} from './teste/teste.component';
import {TesteLoginComponent} from './teste-login/teste-login.component';
import {TesteHomeComponent} from './teste-home/teste-home.component';
import {TesteCaminhaoComponent} from './teste-caminhao/teste-caminhao.component';
import {GerenciarProdutosComponent} from './gerenciar-produtos/gerenciar-produtos.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'cadastro', component: CadastroComponent },
    { path: 'home', component: HomeComponent },
    { path: 'perfil', component: PerfilComponent },
    { path: 'cadastro-caminhao', component: CadastroCaminhaoComponent },
    { path: 'cadastro-produtos', component: CadastroProdutosComponent },
    { path: 'realiza-otimizacao', component: RealizaOtimizacaoComponent },
    { path: 'calcula', component: CalculaComponent },
    { path: 'visualiza', component: VisualizaComponent },
    { path: 'sobre', component: SobreComponent },
    { path: 'teste', component: TesteComponent },
    { path: 'teste-login', component: TesteLoginComponent },
    { path: 'teste-home', component: TesteHomeComponent },
    { path: 'teste-caminhao', component: TesteCaminhaoComponent },
    { path: 'gerenciar-produtos', component: GerenciarProdutosComponent },
];
