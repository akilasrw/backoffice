import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AirWaybillRoutingModule } from './air-waybill-routing.module';
import { AwbStackManagementComponent } from './awb-stack-management/awb-stack-management.component';
import { AwbStackManagementManualComponent } from './awb-stack-management-manual/awb-stack-management-manual.component';
import { AwbNumberCreateComponent } from './awb-number-create/awb-number-create.component';


@NgModule({
  declarations: [
    AwbStackManagementComponent,
    AwbStackManagementManualComponent,
    AwbNumberCreateComponent
  ],
  imports: [
    CommonModule,
    AirWaybillRoutingModule,
    SharedModule
  ]
})
export class AirWaybillModule { }
