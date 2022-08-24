import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlightRoutingModule } from './flight-routing.module';
import { FlightCreateComponent } from './flight-create/flight-create.component';
import { FlightListComponent } from './flight-list/flight-list.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    FlightCreateComponent,
    FlightListComponent
  ],
  imports: [
    CommonModule,
    FlightRoutingModule,
    SharedModule
  ]
})
export class FlightModule { }
