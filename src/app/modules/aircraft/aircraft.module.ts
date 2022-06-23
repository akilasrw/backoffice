import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AircraftRoutingModule } from './aircraft-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AircraftListComponent } from './aircraft-list/aircraft-list.component';


@NgModule({
  declarations: [
    AircraftListComponent
  ],
  imports: [
    CommonModule,
    AircraftRoutingModule,
    SharedModule
  ]
})
export class AircraftModule { }
