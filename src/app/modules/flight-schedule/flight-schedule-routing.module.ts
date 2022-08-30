import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightScheduleListComponent } from './flight-schedule-list/flight-schedule-list.component';

const routes: Routes = [
  { path: '', component: FlightScheduleListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlightScheduleRoutingModule { }
