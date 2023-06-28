import { CargoAgentManagementComponent } from './cargo-agent-management/cargo-agent-management.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageUserListComponent } from './manage-user/manage-user-list/manage-user-list.component';

const routes: Routes = [
  { path: '', component: CargoAgentManagementComponent},
  { path: 'manage-user', component: ManageUserListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
