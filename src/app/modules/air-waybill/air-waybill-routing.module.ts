import { AwbStackManagementComponent } from './awb-stack-management/awb-stack-management.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AwbStackManagementManualComponent } from './awb-stack-management-manual/awb-stack-management-manual.component';

const routes: Routes = [
  { path: '', component: AwbStackManagementManualComponent},
  { path: 'auto', component: AwbStackManagementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AirWaybillRoutingModule { }
