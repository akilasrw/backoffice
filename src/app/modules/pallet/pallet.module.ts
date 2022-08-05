import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PalletRoutingModule } from './pallet-routing.module';
import { PalletManagementComponent } from './pallet-management/pallet-management.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    PalletManagementComponent
  ],
  imports: [
    CommonModule,
    PalletRoutingModule,
    SharedModule
  ]
})
export class PalletModule { }
