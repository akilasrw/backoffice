import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BookingRoutingModule } from './booking-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BookingSummaryListComponent } from './booking-summary/booking-summary-list/booking-summary-list.component';
import { P2cBookingSummaryDetailsComponent } from './booking-summary/booking-summary-details/p2c-booking-summary-details/p2c-booking-summary-details.component';
import { FreighterBookingSummaryDetailsComponent } from './booking-summary/booking-summary-details/freighter-booking-summary-details/freighter-booking-summary-details.component';


@NgModule({
  declarations: [
    BookingSummaryListComponent,
    P2cBookingSummaryDetailsComponent,
    FreighterBookingSummaryDetailsComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule,
    SharedModule,
    BsDatepickerModule
  ]
})
export class BookingModule { }
