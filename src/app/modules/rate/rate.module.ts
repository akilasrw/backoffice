import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RateRoutingModule } from './rate-routing.module';
import { RateListComponent } from './rate-list/rate-list.component';
import { RateCreateComponent } from './rate-create/rate-create.component';
import { RateDetailComponent } from './rate-detail/rate-detail.component';
import { RateUpdateComponent } from './rate-update/rate-update.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { OtherChargesComponent } from './other-charges/other-charges.component';
import { OtherChargesCreateComponent } from './other-charges-create/other-charges-create.component';
import { OtherChargesUpdateComponent } from './other-charges-update/other-charges-update.component';


@NgModule({
  declarations: [
    RateListComponent,
    RateCreateComponent,
    RateDetailComponent,
    RateUpdateComponent,
    OtherChargesComponent,
    OtherChargesCreateComponent,
    OtherChargesUpdateComponent
  ],
  imports: [
    CommonModule,
    RateRoutingModule,
    SharedModule,
    BsDatepickerModule
  ]
})
export class RateModule { }
