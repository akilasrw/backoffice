import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { RouteConstants } from './core/constants/constants';


const routes: Routes = [
  { path: RouteConstants.DefaultRoute, redirectTo: RouteConstants.AccountRoute, pathMatch: 'full' },
  { path: RouteConstants.AccountRoute, loadChildren: () => import('./account/account.module').then(mod => mod.AccountModule) },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
