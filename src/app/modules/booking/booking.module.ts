import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BookingRoutingModule } from './booking-routing.module';
import { BookingSummaryComponent } from './booking-summary/booking-summary.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    BookingSummaryComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule,
    SharedModule,
    BsDatepickerModule
  ]
})
export class BookingModule { }
