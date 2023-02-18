import { Component, OnInit } from '@angular/core';
import { CalendarType } from 'src/app/core/enums/common-enums';
import { AircraftSchedule } from 'src/app/_models/view-models/aircraft-schedule/aircraft-schedule.model';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {

  modalVisible = false;
  modalVisibleAnimate = false;
  updateModalVisible = false;
  updateModalVisibleAnimate = false;
  selectedAircraftSchedule?:AircraftSchedule;
  selectedCalenderType: CalendarType = CalendarType.Daily;
  selectedDate: Date = new Date();
  calendarFirstDate?: Date;
  calendarLastDate?: Date;
  
  constructor() { }

  ngOnInit(): void {
  }

  
  show() {
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  close() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  onScheduleAdd(scheduleDate: Date) {
    this.selectedDate = new Date(scheduleDate);
  }

  get CalendarType(): typeof CalendarType {
    return CalendarType;
  }

  onChangeCalendar(type: CalendarType) {
    this.selectedCalenderType = type;
    if (this.selectedCalenderType == CalendarType.Weekly) {
      var currentDate = new Date(this.selectedDate);
      this.calendarFirstDate = new Date(currentDate.setDate(this.selectedDate.getDate() - this.selectedDate.getDay()));
      this.calendarLastDate = new Date(currentDate.setDate(currentDate.getDate() + 6));
    } else if (this.selectedCalenderType == CalendarType.Monthly){
      this.calendarFirstDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1);
      this.calendarLastDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth()+1, 0);
      this.selectedDate=this.calendarLastDate;
    }
  }

  onDateIncriment() {
    if (this.selectedCalenderType == CalendarType.Daily) {
      this.selectedDate.setDate(this.selectedDate.getDate() + 1);
      this.selectedDate = new Date(this.selectedDate);
    } else if (this.selectedCalenderType == CalendarType.Weekly) {
      this.selectedDate.setDate(this.selectedDate.getDate() + 7);
      var currentDate = new Date(this.selectedDate);
      this.calendarFirstDate = new Date(currentDate.setDate(this.selectedDate.getDate() - this.selectedDate.getDay()));
      this.calendarLastDate = new Date(currentDate.setDate(currentDate.getDate() + 6));
    } else if (this.selectedCalenderType == CalendarType.Monthly) {
      this.calendarFirstDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth()+1, 1);
      this.calendarLastDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth()+2, 0);
      this.selectedDate=this.calendarLastDate;
    }

  }

  onDateDecriment() {
    if (this.selectedCalenderType == CalendarType.Daily) {
      this.selectedDate.setDate(this.selectedDate.getDate() + -1);
      this.selectedDate = new Date(this.selectedDate);
    } else if (this.selectedCalenderType == CalendarType.Weekly) {
      this.selectedDate.setDate(this.selectedDate.getDate() + -7);
      var currentDate = new Date(this.selectedDate);
      this.calendarFirstDate = new Date(currentDate.setDate(this.selectedDate.getDate() - this.selectedDate.getDay() ));
      this.calendarLastDate = new Date(currentDate.setDate(currentDate.getDate() + 6));
    } else if (this.selectedCalenderType == CalendarType.Monthly) {
      this.calendarFirstDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth()-1, 1);
      this.calendarLastDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 0);
      this.selectedDate=this.calendarFirstDate;
    }
  }

  onDayClick(date: Date) {
    this.selectedCalenderType = CalendarType.Daily;
    this.onScheduleAdd(date);
    console.log(date);
  }

  scheduleUpdate(schedule:AircraftSchedule){
    this.selectedAircraftSchedule=schedule;
    this.showUpdate();
  }

  showUpdate() {
    this.updateModalVisible = true;
    setTimeout(() => (this.updateModalVisibleAnimate = true));
  }

  closeUpdate(){
    this.updateModalVisibleAnimate = false;
    setTimeout(() => (this.updateModalVisible = false), 300);
  }

  onScheduleUpdate(scheduleDate: Date) {
    this.selectedDate = new Date(scheduleDate);
  }

}
