import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingSummaryListComponent } from './booking-summary/booking-summary-list/booking-summary-list.component';

const routes: Routes = [
  { path: '', component: BookingSummaryListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }
