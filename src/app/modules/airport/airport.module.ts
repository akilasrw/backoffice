import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AirportRoutingModule } from './airport-routing.module';
import { AirportListComponent } from './airport-list/airport-list.component';
import { AirportCreateComponent } from './airport-create/airport-create.component';


@NgModule({
  declarations: [
    AirportListComponent,
    AirportCreateComponent
  ],
  imports: [
    CommonModule,
    AirportRoutingModule
  ]
})
export class AirportModule { }
