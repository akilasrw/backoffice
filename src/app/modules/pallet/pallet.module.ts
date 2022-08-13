import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PalletRoutingModule } from './pallet-routing.module';
import { PalletManagementComponent } from './pallet-management/pallet-management.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PalletCreateComponent } from './pallet-create/pallet-create.component';


@NgModule({
  declarations: [
    PalletManagementComponent,
    PalletCreateComponent
  ],
  imports: [
    CommonModule,
    PalletRoutingModule,
    SharedModule,
    BsDatepickerModule
  ]
})
export class PalletModule { }
