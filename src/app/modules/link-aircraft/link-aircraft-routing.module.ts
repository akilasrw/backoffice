import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignAircraftMasterViewComponent } from './assign-aircraft-master-view/assign-aircraft-master-view.component';
import { LinkAircraftListComponent } from './assign-aircraft-master-view/link-aircraft-list/link-aircraft-list.component';

const routes: Routes = [
  { path: '', component: AssignAircraftMasterViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinkAircraftRoutingModule { }
