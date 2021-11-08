import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditarUsuariosComponent } from './editar-usuarios/editar-usuarios.component';
import { FormularioUsuariosComponent } from './formulario-usuarios/formulario-usuarios.component';
import { RelatorioUsuariosComponent } from './relatorio-usuarios/relatorio-usuarios.component';

const routes: Routes = [
  {
    path: 'relatorio-usuarios', component: RelatorioUsuariosComponent
  },
  {
    path: '',
    redirectTo: 'relatorio-usuarios',
    pathMatch: 'full'
  },
  {
    path: 'formulario-usuarios', component: FormularioUsuariosComponent
  },
  {
    path: 'editar-usuarios', component: EditarUsuariosComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
