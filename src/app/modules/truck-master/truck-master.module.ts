import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruckMasterRoutingModule } from './truck-master-routing.module';
import { TruckMasterListComponent } from './truck-master-list/truck-master-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TruckFormComponent } from './truck-form/truck-form.component';


@NgModule({
  declarations: [
    TruckMasterListComponent,
    TruckFormComponent
  ],
  imports: [
    CommonModule,
    TruckMasterRoutingModule,
    CommonModule,
    SharedModule,
  ]
})
export class TruckMasterModule { }