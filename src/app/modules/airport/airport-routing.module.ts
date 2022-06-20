import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AirportListComponent } from './airport-list/airport-list.component';

const routes: Routes = [
  { path: '', component: AirportListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AirportRoutingModule { }
