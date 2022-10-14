import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RateRoutingModule } from './rate-routing.module';
import { RateListComponent } from './rate-list/rate-list.component';
import { RateCreateComponent } from './rate-create/rate-create.component';
import { RateDetailComponent } from './rate-detail/rate-detail.component';
import { RateUpdateComponent } from './rate-update/rate-update.component';


@NgModule({
  declarations: [
    RateListComponent,
    RateCreateComponent,
    RateDetailComponent,
    RateUpdateComponent
  ],
  imports: [
    CommonModule,
    RateRoutingModule,
    SharedModule
  ]
})
export class RateModule { }
