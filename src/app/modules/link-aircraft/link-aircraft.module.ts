import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkAircraftRoutingModule } from './link-aircraft-routing.module';
import { LinkAircraftListComponent } from './assign-aircraft-master-view/link-aircraft-list/link-aircraft-list.component';
import { LinkAircraftCreateComponent } from './link-aircraft-create/link-aircraft-create.component';
import { AssignAircraftMasterViewComponent } from './assign-aircraft-master-view/assign-aircraft-master-view.component';


@NgModule({
  declarations: [
    LinkAircraftListComponent,
    LinkAircraftCreateComponent,
    AssignAircraftMasterViewComponent
  ],
  imports: [
    CommonModule,
    LinkAircraftRoutingModule,
    SharedModule
  ],
  exports:[LinkAircraftCreateComponent]
})
export class LinkAircraftModule { }
