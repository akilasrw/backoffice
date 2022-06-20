import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SectorRoutingModule } from './sector-routing.module';
import { SectorListComponent } from './sector-list/sector-list.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SectorListComponent
  ],
  imports: [
    CommonModule,
    SectorRoutingModule,
    SharedModule
  ]
})
export class SectorModule { }
