import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SectorRoutingModule } from './sector-routing.module';
import { SectorListComponent } from './sector-list/sector-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SectorCreateComponent } from './sector-create/sector-create.component';


@NgModule({
  declarations: [
    SectorListComponent,
    SectorCreateComponent
  ],
  imports: [
    CommonModule,
    SectorRoutingModule,
    SharedModule
  ]
})
export class SectorModule { }
