import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../core/guards/login.guard';
import { LoginComponent } from './login/login.component';
import { NewPasswordComponent } from './new-password/new-password.component';

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [LoginGuard]},
  { path: 'new-password/:id', component: NewPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
