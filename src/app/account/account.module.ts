import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { LoginLeftSideComponent } from './login-left-side/login-left-side.component';
import { NewPasswordComponent } from './new-password/new-password.component';


@NgModule({
  declarations: [
    LoginComponent,
    LoginLeftSideComponent,
    NewPasswordComponent
  ],
  imports: [
    AccountRoutingModule,
    SharedModule
  ]
})
export class AccountModule { }
