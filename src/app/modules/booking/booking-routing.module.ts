import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FreighterBookingSummaryDetailsComponent } from './booking-summary/booking-summary-details/freighter-booking-summary-details/freighter-booking-summary-details.component';
import { P2cBookingSummaryDetailsComponent } from './booking-summary/booking-summary-details/p2c-booking-summary-details/p2c-booking-summary-details.component';
import { BookingSummaryListComponent } from './booking-summary/booking-summary-list/booking-summary-list.component';

const routes: Routes = [
  { path: '', component: BookingSummaryListComponent},
  { path: 'p2cSummaryDetails/:id', component: P2cBookingSummaryDetailsComponent},
  { path: 'freighterSummaryDetails/:id', component: FreighterBookingSummaryDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }
