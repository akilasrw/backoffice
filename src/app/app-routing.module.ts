import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { RouteConstants } from './core/constants/constants';


const routes: Routes = [
  { path: RouteConstants.DefaultRoute, redirectTo: RouteConstants.DashboardRoute, pathMatch: 'full' },
  { path: RouteConstants.AccountRoute, loadChildren: () => import('./account/account.module').then(mod => mod.AccountModule) },
  { path: RouteConstants.DashboardRoute, loadChildren: () => import('./modules/home/home.module').then(mod => mod.HomeModule) },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
