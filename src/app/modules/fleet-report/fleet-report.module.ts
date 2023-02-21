import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FleetReportRoutingModule } from './fleet-report-routing.module';
import { FleetAnalysisReportComponent } from './fleet-analysis-report/fleet-analysis-report.component';


@NgModule({
  declarations: [
    FleetAnalysisReportComponent
  ],
  imports: [
    CommonModule,
    FleetReportRoutingModule,
    SharedModule
  ]
})
export class FleetReportModule { }
