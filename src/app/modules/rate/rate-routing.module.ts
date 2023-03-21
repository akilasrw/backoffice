import { OtherChargesComponent } from './other-charges/other-charges.component';
import { RateListComponent } from './rate-list/rate-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: RateListComponent},
  { path: 'otherCharges', component: OtherChargesComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateRoutingModule { }
