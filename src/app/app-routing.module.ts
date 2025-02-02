import { UldMasterModule } from './modules/uld-master/uld-master.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { RouteConstants } from './core/constants/constants';
import { AuthGuard } from './core/guards/auth.guard';
import { ServerErrorComponent } from './core/components/server-error/server-error.component';
import { AccountGuard } from './core/guards/account.guard';
import { LoginGuard } from './core/guards/login.guard';


const routes: Routes = [
  { path: RouteConstants.DefaultRoute, redirectTo: RouteConstants.DashboardRoute, pathMatch: 'full' },
  { path: RouteConstants.AccountRoute, loadChildren: () => import('./account/account.module').then(mod => mod.AccountModule), canActivate: [LoginGuard] },
  { path: RouteConstants.DashboardRoute, loadChildren: () => import('./modules/home/home.module').then(mod => mod.HomeModule), canActivate: [AuthGuard]},
  { path: RouteConstants.BookingSummaryRoute, loadChildren: () => import('./modules/booking/booking.module').then(mod => mod.BookingModule), canActivate: [AuthGuard]},
  { path: RouteConstants.AirWaybillRoute, loadChildren: ()=> import('./modules/air-waybill/air-waybill.module').then(mod => mod.AirWaybillModule), canActivate: [AuthGuard]},
  { path: RouteConstants.AirportRoute, loadChildren: ()=> import('./modules/airport/airport.module').then(mod => mod.AirportModule), canActivate: [AuthGuard]},
  { path: RouteConstants.SectorRoute, loadChildren: ()=> import('./modules/sector/sector.module').then(mod => mod.SectorModule), canActivate: [AuthGuard]},
  { path: RouteConstants.AircraftRoute, loadChildren: ()=> import('./modules/aircraft/aircraft.module').then(mod => mod.AircraftModule), canActivate: [AuthGuard]},
  { path: RouteConstants.PalletRoute, loadChildren: ()=> import('./modules/pallet/pallet.module').then(mod => mod.PalletModule), canActivate: [AuthGuard]},
  { path: RouteConstants.FlightRoute, loadChildren: ()=> import('./modules/flight/flight.module').then(mod => mod.FlightModule), canActivate: [AuthGuard]},
  { path: RouteConstants.FlightSchedule, loadChildren: ()=> import('./modules/flight-schedule/flight-schedule.module').then(mod => mod.FlightScheduleModule), canActivate: [AuthGuard]},
  { path: RouteConstants.Rate, loadChildren: ()=> import('./modules/rate/rate.module').then(mod => mod.RateModule), canActivate: [AuthGuard]},
  { path: RouteConstants.UserManagement, loadChildren: ()=> import('./modules/user-management/user-management.module').then(mod => mod.UserManagementModule), canActivate: [AuthGuard]},
  { path: RouteConstants.Notification, loadChildren: ()=> import('./modules/notification/notification.module').then(mod => mod.NotificationModule), canActivate: [AuthGuard]},
  { path: RouteConstants.MasterSchedule, loadChildren: ()=> import('./modules/master-schedule/master-schedule.module').then(mod => mod.MasterScheduleModule),canActivate: [AuthGuard]},
  { path: RouteConstants.LinkAircraft, loadChildren: ()=> import('./modules/link-aircraft/link-aircraft.module').then(mod => mod.LinkAircraftModule),canActivate: [AuthGuard]},
  { path: RouteConstants.FleetReport, loadChildren: ()=> import('./modules/fleet-report/fleet-report.module').then(mod => mod.FleetReportModule),canActivate: [AuthGuard]},
  { path: RouteConstants.ULDMaster, loadChildren: ()=> import('./modules/uld-master/uld-master.module').then(mod => mod.UldMasterModule),canActivate: [AuthGuard]},
  { path: RouteConstants.MessageRoute, loadChildren: () => import('./modules/chatting/chatting.module').then(mod => mod.ChattingModule), canActivate: [AuthGuard] },
  { path: RouteConstants.TruckMaster, loadChildren: ()=> import('./modules/truck-master/truck-master.module').then(mod => mod.TruckMasterModule),canActivate: [AuthGuard]},
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
