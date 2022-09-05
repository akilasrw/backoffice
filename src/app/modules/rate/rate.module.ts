import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RateRoutingModule } from './rate-routing.module';
import { RateListComponent } from './rate-list/rate-list.component';
import { RateCreateComponent } from './rate-create/rate-create.component';
import { RateDetailComponent } from './rate-detail/rate-detail.component';


@NgModule({
  declarations: [
    RateListComponent,
    RateCreateComponent,
    RateDetailComponent
  ],
  imports: [
    CommonModule,
    RateRoutingModule,
    SharedModule
  ]
})
export class RateModule { }
