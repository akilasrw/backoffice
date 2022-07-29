import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BookingRoutingModule } from './booking-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BookingSummaryListComponent } from './booking-summary/booking-summary-list/booking-summary-list.component';
import { BookingSummaryDetailsComponent } from './booking-summary/booking-summary-details/booking-summary-details.component';


@NgModule({
  declarations: [
    BookingSummaryListComponent,
    BookingSummaryDetailsComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule,
    SharedModule,
    BsDatepickerModule
  ]
})
export class BookingModule { }
