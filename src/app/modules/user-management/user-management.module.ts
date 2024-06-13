import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { CargoAgentManagementComponent } from './cargo-agent-management/cargo-agent-management.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageUserListComponent } from './manage-user/manage-user-list/manage-user-list.component';
import { CreateUserComponent } from './manage-user/create-user/create-user.component';
import { CreateCargoAgentComponent } from './create-cargo-agent/create-cargo-agent.component';
import { UpdateUserComponent } from './manage-user/update-user/update-user.component';


@NgModule({
  declarations: [
    CargoAgentManagementComponent,
    ManageUserListComponent,
    CreateUserComponent,
    UpdateUserComponent,
    CreateCargoAgentComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    SharedModule
  ]
})
export class UserManagementModule { }
