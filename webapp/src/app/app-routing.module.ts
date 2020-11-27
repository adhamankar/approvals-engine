import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found.component';


const routes: Routes = [

  { path: 'workflows', loadChildren: () => import('./templates/templates.module').then(m => m.TemplatesModule) },
  { path: '', pathMatch: 'full', redirectTo: 'workflows' },
  { path: '**', component: PageNotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
