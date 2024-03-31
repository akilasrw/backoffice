import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    HomeComponent
  ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        BsDatepickerModule,
        SharedModule
    ]
})
export class HomeModule { }
