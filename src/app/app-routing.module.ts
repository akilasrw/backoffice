import { AirWaybillModule } from './modules/air-waybill/air-waybill.module';
import { BookingModule } from './modules/booking/booking.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { RouteConstants } from './core/constants/constants';
import { AuthGuard } from './core/guards/auth.guard';
import { ServerErrorComponent } from './core/components/server-error/server-error.component';


const routes: Routes = [
  { path: RouteConstants.DefaultRoute, redirectTo: RouteConstants.DashboardRoute, pathMatch: 'full' },
  { path: RouteConstants.AccountRoute, loadChildren: () => import('./account/account.module').then(mod => mod.AccountModule) },
  { path: RouteConstants.DashboardRoute, loadChildren: () => import('./modules/home/home.module').then(mod => mod.HomeModule), canActivate: [AuthGuard]},
  { path: RouteConstants.BookingSummaryRoute, loadChildren: () => import('./modules/booking/booking.module').then(mod => mod.BookingModule), canActivate: [AuthGuard]},
  { path: RouteConstants.AirWaybillRoute, loadChildren: ()=> import('./modules/air-waybill/air-waybill.module').then(mod => mod.AirWaybillModule), canActivate: [AuthGuard]},
  { path: RouteConstants.AirportRoute, loadChildren: ()=> import('./modules/airport/airport.module').then(mod => mod.AirportModule), canActivate: [AuthGuard]},
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
