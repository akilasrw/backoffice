import { AircraftSchedule } from 'src/app/_models/view-models/aircraft-schedule/aircraft-schedule.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ScheduleStatus } from 'src/app/core/enums/common-enums';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { MasterSchedule } from 'src/app/_models/view-models/aircraft-schedule/master-schedule.model';
import { MasterScheduleListQuery } from 'src/app/_models/queries/aircraft-schedule/master-schedule-list-query.model';
import { AircraftScheduleService } from 'src/app/_services/aircraft-schedule.service';


@Component({
  selector: 'app-calendar-weekly-view',
  templateUrl: './calendar-weekly-view.component.html',
  styleUrls: ['./calendar-weekly-view.component.scss']
})
export class CalendarWeeklyViewComponent implements OnInit {

  @Input() set calendarFirstDate(calendarFirstDate: Date) {
    if (calendarFirstDate != null) {
      this.weekFirstDate = calendarFirstDate;
      this.setTimelineDates(this.weekFirstDate);
    }
  }
  @Input() set calendarLastDate(calendarLastDate: Date) {
    if (calendarLastDate != null) {
      this.weekLastDate = calendarLastDate;
      if (this.weekFirstDate != null && this.weekLastDate != null) this.getSchedules(this.weekFirstDate, this.weekLastDate);
    }
  }
  @Output() dayClick = new EventEmitter<any>();

  weekFirstDate?: Date;
  weekLastDate?: Date;
  schedules: AircraftSchedule[] = [];
  masterSchedules: MasterSchedule[] = [];
  timeLine: Date[] = [];
  hoverScheduleID?: string;
  hoverScheduleDate?:Date;
  
  constructor(private scheduleService: AircraftScheduleService) { }

  ngOnInit(): void {
  }

  
  getSchedules(weekFirstDate: Date, weekLastDate: Date) {
    var listQuery = new MasterScheduleListQuery();
    listQuery.scheduleStartDate = weekFirstDate;
    listQuery.scheduleEndDate = weekLastDate;
    listQuery.isIncludeAircraft = true;

    this.scheduleService.getAircraftScheduleList(listQuery).subscribe({
      next: (res) => {
        this.schedules = res;
        this.masterSchedules = this.filterSchedules(this.schedules);
      },
      error: (err) => {

      },
    });
  }

  setTimelineDates(weekFirstDate: Date) {
    this.timeLine = [];
    this.timeLine.push(new Date(weekFirstDate));
    var dayOne = new Date(weekFirstDate);
    for (let i = 0; i < 6; i++) {
      this.timeLine.push(new Date(dayOne.setDate(dayOne.getDate() + 1)));
    }
  }

  filterSchedules(schedules: AircraftSchedule[]): MasterSchedule[] {
    var masterSchedules: MasterSchedule[] = [];
    const aircrafts = [...new Set(schedules.map(item => item.aircraftId))];
    aircrafts.forEach(element => {
      var aircraftScheduleList: AircraftSchedule[] = [];
      aircraftScheduleList = schedules.filter(x => x.aircraftId === element);
      var newMaster = new MasterSchedule();
      newMaster.aircraftRegNo = aircraftScheduleList[0].regNo;
      newMaster.airctaftSchedules = aircraftScheduleList;
      masterSchedules.push(newMaster);
    });
    return masterSchedules;
  }

  isSameDate(scheduleStartDate: Date,scheduleEndDate :Date, timeLineDate: Date): boolean {
    var shStartDate = new Date(scheduleStartDate);
    var shEndDate = new Date(scheduleEndDate);
    var tlDate = new Date(timeLineDate);
    if (shStartDate.getDate() == tlDate.getDate()) {
      return true;
    } else {
      if(shStartDate.getTime() < tlDate.getTime() && tlDate.getTime()<=shEndDate.getTime()){
        return true;
      }else{
        return false;
      }
    }
  }

  getScheduleStaus(type: number) {
    return CoreExtensions.GetScheduleStaus(type);
  }

  get ScheduleStatus(): typeof ScheduleStatus {
    return ScheduleStatus;
  }

  mouseEnter(id: string,date:Date) {
    this.hoverScheduleID = id;
    this.hoverScheduleDate = date;
  }

  mouseLeave() {
    this.hoverScheduleID = undefined;
    this.hoverScheduleDate = undefined;
  }

  onDayClick(date: Date) {
    this.dayClick.emit(date);
  }


}
