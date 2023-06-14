import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RateMasterViewComponent } from './rate-master-view/rate-master-view.component';

const routes: Routes = [
  { path: '', component: RateMasterViewComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateRoutingModule { }
