import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterScheduleRoutingModule } from './master-schedule-routing.module';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CalendarWeeklyViewComponent } from './calendar-view/calendar-weekly-view/calendar-weekly-view.component';
import { CalendarMonthlyViewComponent } from './calendar-view/calendar-monthly-view/calendar-monthly-view.component';
import { CalendarDailyViewComponent } from './calendar-view/calendar-daily-view/calendar-daily-view.component';
import { MasterScheduleCreateComponent } from './master-schedule-create/master-schedule-create.component';
import { MasterScheduleUpdateComponent } from './master-schedule-update/master-schedule-update.component';


@NgModule({
  declarations: [
    CalendarViewComponent,
    CalendarWeeklyViewComponent,
    CalendarMonthlyViewComponent,
    CalendarDailyViewComponent,
    MasterScheduleCreateComponent,
    MasterScheduleUpdateComponent
  ],
  imports: [
    CommonModule,
    MasterScheduleRoutingModule,
    SharedModule,
    BsDatepickerModule,
    //LinkAircraftModule
  ]
})
export class MasterScheduleModule { }
