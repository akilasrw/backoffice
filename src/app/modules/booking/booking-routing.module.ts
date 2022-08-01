import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingSummaryDetailsComponent } from './booking-summary/booking-summary-details/booking-summary-details.component';
import { BookingSummaryListComponent } from './booking-summary/booking-summary-list/booking-summary-list.component';

const routes: Routes = [
  { path: '', component: BookingSummaryListComponent},
  { path: 'summaryDetails', component: BookingSummaryDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }
