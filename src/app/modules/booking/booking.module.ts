import { CoreModule } from './../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BookingRoutingModule } from './booking-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BookingSummaryListComponent } from './booking-summary/booking-summary-list/booking-summary-list.component';
import { P2cBookingSummaryDetailsComponent } from './booking-summary/booking-summary-details/p2c-booking-summary-details/p2c-booking-summary-details.component';
import { FreighterBookingSummaryDetailsComponent } from './booking-summary/booking-summary-details/freighter-booking-summary-details/freighter-booking-summary-details.component';
import { BookingSummaryLirComponent } from './booking-summary/booking-summary-details/booking-summary-lir/booking-summary-lir.component';
import { FreighterUldDetailsComponent } from './booking-summary/booking-summary-details/freighter-uld-details/freighter-uld-details.component';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { AssignBookingComponent } from './booking-summary/booking-summary-details/assign-booking/assign-booking.component';
import { FreighterBookingSummaryDetailV2Component } from './booking-summary/booking-summary-detail-v2/freighter-booking-summary-detail-v2/freighter-booking-summary-detail-v2.component';
import { StandByCargoMasterComponent } from './stand-by-cargo-master/stand-by-cargo-master.component';
import { StandByCargoUpdateComponent } from './stand-by-cargo-update/stand-by-cargo-update.component';


@NgModule({
  declarations: [
    BookingSummaryListComponent,
    P2cBookingSummaryDetailsComponent,
    FreighterBookingSummaryDetailsComponent,
    BookingSummaryLirComponent,
    FreighterUldDetailsComponent,
    BookingDetailComponent,
    AssignBookingComponent,
    FreighterBookingSummaryDetailV2Component,
    StandByCargoMasterComponent,
    StandByCargoUpdateComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule,
    SharedModule,
    BsDatepickerModule,
    CoreModule
  ]
})
export class BookingModule { }
