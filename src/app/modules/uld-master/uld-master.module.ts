import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UldMasterRoutingModule } from './uld-master-routing.module';
import { UldMasterListComponent } from './uld-master-list/uld-master-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UldCreateComponent } from './uld-create/uld-create.component';


@NgModule({
  declarations: [
    UldMasterListComponent,
    UldCreateComponent
  ],
  imports: [
    CommonModule,
    UldMasterRoutingModule,
    CommonModule,
    SharedModule,
  ]
})
export class UldMasterModule { }
