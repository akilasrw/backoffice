import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AirWaybillRoutingModule } from './air-waybill-routing.module';
import { AwbStackManagementComponent } from './awb-stack-management/awb-stack-management.component';


@NgModule({
  declarations: [
    AwbStackManagementComponent
  ],
  imports: [
    CommonModule,
    AirWaybillRoutingModule,
    SharedModule
  ]
})
export class AirWaybillModule { }
