import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AircraftRoutingModule } from './aircraft-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AircraftListComponent } from './aircraft-list/aircraft-list.component';
import { AircraftCreateComponent } from './aircraft-create/aircraft-create.component';


@NgModule({
  declarations: [
    AircraftListComponent,
    AircraftCreateComponent
  ],
  imports: [
    CommonModule,
    AircraftRoutingModule,
    SharedModule
  ]
})
export class AircraftModule { }
