import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightScheduleRoutingModule } from './flight-schedule-routing.module';
import { FlightScheduleListComponent } from './flight-schedule-list/flight-schedule-list.component';
import { FlightScheduleCreateComponent } from './flight-schedule-create/flight-schedule-create.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    FlightScheduleListComponent,
    FlightScheduleCreateComponent
  ],
  imports: [
    CommonModule,
    FlightScheduleRoutingModule,
    SharedModule
  ]
})
export class FlightScheduleModule { }
