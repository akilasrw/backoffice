import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FleetAnalysisReportComponent } from './fleet-analysis-report/fleet-analysis-report.component';

const routes: Routes = [
  {path:'',component:FleetAnalysisReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetReportRoutingModule { }
