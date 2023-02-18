import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MasterScheduleListQuery } from 'src/app/_models/queries/aircraft-schedule/master-schedule-list-query.model';
import { AircraftSchedule } from 'src/app/_models/view-models/aircraft-schedule/aircraft-schedule.model';
import { AircraftScheduleService } from 'src/app/_services/aircraft-schedule.service';

@Component({
  selector: 'app-calendar-monthly-view',
  templateUrl: './calendar-monthly-view.component.html',
  styleUrls: ['./calendar-monthly-view.component.scss']
})
export class CalendarMonthlyViewComponent implements OnInit {


  @Input() set calendarFirstDate(calendarFirstDate: Date) {
    if (calendarFirstDate != null) {
      this.monthFirstDate = calendarFirstDate;
    }
  }
  @Input() set calendarLastDate(calendarLastDate: Date) {
    if (calendarLastDate != null && this.monthFirstDate != null) {
      this.monthLastDate = calendarLastDate;

      this.setTimelineDates(this.monthFirstDate, this.monthLastDate);

      if (this.monthFirstDate != null && this.monthLastDate != null) this.getSchedules(this.monthFirstDate, this.monthLastDate);
    }
  }
  @Output() dayClick = new EventEmitter<any>();

  monthFirstDate?: Date;
  monthLastDate?: Date;
  timeLine: Date[] = [];
  filterdSchedules: AircraftSchedule[] = [];

  constructor(private scheduleService: AircraftScheduleService) { }

  ngOnInit(): void {
  }

  getSchedules(monthFirstDate: Date, monthLastDate: Date) {
    var listQuery = new MasterScheduleListQuery();
    listQuery.scheduleStartDate = monthFirstDate;
    listQuery.scheduleEndDate = monthLastDate;
    listQuery.isIncludeAircraft = true;

    this.scheduleService.getAircraftScheduleList(listQuery).subscribe({
      next: (res) => {
        this.filterdSchedules = this.filterSchedules(res);
        this.setTimelineDates(monthFirstDate, monthLastDate);
      },
      error: (err) => {

      },
    });
  }

  filterSchedules(schedules: AircraftSchedule[]): AircraftSchedule[] {
    var filterdSchedules: AircraftSchedule[] = [];
    for (let schedule of schedules) {
      if (schedule.scheduleStartDateTime != null) {
        if (!(filterdSchedules.find(e => this.getDatePart(e.scheduleStartDateTime!).getTime() === this.getDatePart(schedule.scheduleStartDateTime!).getTime() && e.aircraftId === schedule.aircraftId))) {
          filterdSchedules.push(schedule);
        }
      }
    }

    var displaySchedules: AircraftSchedule[] = filterdSchedules.slice(0);

    for(let schedule of filterdSchedules){
      if(schedule.scheduleStartDateTime != null && schedule.scheduleEndDateTime != null){
        var timeDif = this.getDatePart(schedule.scheduleEndDateTime).getTime()- this.getDatePart(schedule.scheduleStartDateTime).getTime(); 
        var numDays = timeDif / (1000 * 3600 * 24);
        for(let day = 1; day <= numDays; day++){
            displaySchedules.push(this.addDateRangeMiddleElements(schedule,day));
        }
      }
    }

    return displaySchedules;
  }

  addDateRangeMiddleElements(schedule:AircraftSchedule,incriment:number): AircraftSchedule{
    var newSchedule = new AircraftSchedule();
    newSchedule.id = schedule.id;
    newSchedule.isCompleted=schedule.isCompleted;
    newSchedule.regNo= schedule.regNo;
    newSchedule.aircraftId=schedule.aircraftId;
    newSchedule.scheduleStatus=schedule.scheduleStatus;
    newSchedule.scheduleStartDateTime=schedule.scheduleStartDateTime;
    newSchedule.scheduleEndDateTime=schedule.scheduleEndDateTime;
    var startDate = new Date(newSchedule.scheduleStartDateTime!);
    var incrimentedDate = new Date();
    for(let day=1;day<=incriment;day++){
      incrimentedDate.setDate(startDate.getDate()+day);

      if(incrimentedDate.getMonth()===12 && incrimentedDate.getDate()===31){
        incrimentedDate.setMonth(startDate.getMonth()+1);
      }
    }
    newSchedule.scheduleStartDateTime= incrimentedDate;
    return newSchedule;
  }

  setTimelineDates(firstDate: Date, lastDate: Date) {
    this.timeLine = [];
    var currentDate = new Date(firstDate);
    var firstDay = new Date(firstDate);
    var lastDay = new Date(lastDate);

    var calendarFirstDate = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));

    var preRemainingDays = firstDay.getDay();
    var monthDayCount = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0).getDate();
    var lastRemainingDays = 6 - lastDay.getDay();
    var totalDays = preRemainingDays + monthDayCount + lastRemainingDays;

    this.timeLine.push(new Date(calendarFirstDate));

    for (let i = 1; i < totalDays; i++) {
      this.timeLine.push(new Date(calendarFirstDate.setDate(calendarFirstDate.getDate() + 1)));
    }
  }


  isCurrentMonth(date: Date): boolean {
    var selectedDay = new Date();
    if (this.monthFirstDate != null) selectedDay = new Date(this.monthFirstDate);
    var selectDay = new Date(date);
    return selectedDay.getMonth() != selectDay.getMonth();
  }

  isScheduleAvailable(date: Date): boolean {
    if (this.filterdSchedules != null) {
      for (let schedule of this.filterdSchedules) {
        if (schedule.scheduleStartDateTime == null) return false;
        if (this.getDatePart(schedule.scheduleStartDateTime).getTime() === this.getDatePart(date).getTime()) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  }

  getDailySchedules(date: Date): AircraftSchedule[] {
    return this.filterdSchedules.filter(e => this.getDatePart(e.scheduleStartDateTime!).getTime() === this.getDatePart(date).getTime());
  }

  getDatePart(date: Date): Date {
    var newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }

  onDayClick(date: Date) {
    this.dayClick.emit(date);
  }

}
