import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AircraftRoutingModule } from './aircraft-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AircraftListComponent } from './aircraft-list/aircraft-list.component';
import { AircraftCreateComponent } from './aircraft-create/aircraft-create.component';
import { AircraftSelectLayoutComponent } from './aircraft-select-layout/aircraft-select-layout.component';


@NgModule({
  declarations: [
    AircraftListComponent,
    AircraftCreateComponent,
    AircraftSelectLayoutComponent
  ],
  imports: [
    CommonModule,
    AircraftRoutingModule,
    SharedModule
  ]
})
export class AircraftModule { }
