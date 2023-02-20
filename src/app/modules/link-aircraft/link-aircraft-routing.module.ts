import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinkAircraftListComponent } from './link-aircraft-list/link-aircraft-list.component';

const routes: Routes = [
  { path: '', component: LinkAircraftListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinkAircraftRoutingModule { }
