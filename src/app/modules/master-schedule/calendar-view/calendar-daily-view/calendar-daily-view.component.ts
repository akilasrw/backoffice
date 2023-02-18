import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ScheduleStatus } from 'src/app/core/enums/common-enums';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { MasterScheduleListQuery } from 'src/app/_models/queries/aircraft-schedule/master-schedule-list-query.model';
import { AircraftSchedule } from 'src/app/_models/view-models/aircraft-schedule/aircraft-schedule.model';
import { MasterSchedule } from 'src/app/_models/view-models/aircraft-schedule/master-schedule.model';
import { AircraftScheduleService } from 'src/app/_services/aircraft-schedule.service';

@Component({
  selector: 'app-calendar-daily-view',
  templateUrl: './calendar-daily-view.component.html',
  styleUrls: ['./calendar-daily-view.component.scss']
})
export class CalendarDailyViewComponent implements OnInit {


  modalVisible = false;
  modalVisibleAnimate = false;
  @Output() submitSuccess = new EventEmitter<any>();
  @Input() set selectedDate(selectedDate: Date) {
    if (selectedDate != null) {
      this.selectedScheduleDate = selectedDate
      this.getSchedule(selectedDate);
    }
  }
  @Output() updateSchedule = new EventEmitter<any>();

  hoverScheduleID?:string;
  hoverFlightScheduleID?:string;
  clickedFlightScheduleID?:string;
  selectedScheduleDate: Date = new Date();
  schedules: AircraftSchedule[] = [];
  masterSchedules: MasterSchedule[] = [];
  timeLine:String[]=["00:00","1:00","2:00","3:00","4:00","5:00","6:00","7:00","8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00","00:00"];


  constructor(private scheduleService: AircraftScheduleService) { }

  ngOnInit(): void {

  }

  getSchedule(selectedDate: Date) {
    var listQuery = new MasterScheduleListQuery();
    listQuery.scheduleStartDate = selectedDate;
    listQuery.scheduleEndDate = selectedDate;
    listQuery.isIncludeAircraft = true;
    listQuery.isIncludeFlightSchedules = true;

    this.scheduleService.getAircraftScheduleList(listQuery).subscribe({
      next: (res) => {
        this.schedules = res;
        this.masterSchedules = this.filterSchedules(this.schedules);
      },
      error: (err) => {

      },
    });
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


  getScheduleStaus(type: number) {
    return CoreExtensions.GetScheduleStaus(type);
  }

  get ScheduleStatus(): typeof ScheduleStatus {
    return ScheduleStatus;
  }

  getScheduleStartPixel(startDateTime: Date): string {
    if(this.getDatePart(this.selectedScheduleDate).getTime() != this.getDatePart(startDateTime).getTime())return "0px";

    var startDate = new Date(startDateTime);
    var hours = startDate.getHours();
    var minutes = startDate.getMinutes();
    var totalPixels = (hours * 180) + (minutes * 3);
    return totalPixels.toString() + "px";
  }

  getTimeSlotPixel(startDate: Date, endDate: Date): string {

    if((this.getDatePart(this.selectedScheduleDate).getTime() != this.getDatePart(startDate).getTime()) && (this.getDatePart(this.selectedScheduleDate).getTime() != this.getDatePart(endDate).getTime()))return "4500px";

    var startTotalPixels=0;
    if(this.getDatePart(this.selectedScheduleDate).getTime() === this.getDatePart(startDate).getTime()){
      var newDate = new Date(startDate);
      var hours = newDate.getHours();
      var minutes = newDate.getMinutes();
      startTotalPixels = (hours * 180) + (minutes * 3);
    }

    if(this.getDatePart(this.selectedScheduleDate).getTime() != this.getDatePart(startDate).getTime()){
      startDate=this.getDatePart(endDate);
    }

    var diff = new Date(endDate).getTime() - new Date(startDate).getTime();
    var seconds = diff / 1000;
    var timeSlotTotalPixels = seconds * 0.05;

    var totalPixels = startTotalPixels+timeSlotTotalPixels;

    if(totalPixels>4500){
      return (4500-startTotalPixels).toString() + "px";
    }else{
      return timeSlotTotalPixels.toString() + "px";
    }

  }

  getDatePart(date:Date):Date{
    var newDate =new Date(date);
    newDate.setHours(0,0,0,0);
    return newDate;
  }

  mouseEnter(id:string){
    this.hoverScheduleID=id;
  }

  mouseLeave(){
    this.hoverScheduleID=undefined;
  }

  blockMouseEnter(id:string){
    this.hoverFlightScheduleID=id;
  }

  blockMouseLeave(){
    this.hoverFlightScheduleID=undefined;
  }

  close() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  show(flight: any) {
    this.clickedFlightScheduleID = flight.id;
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  onSubmitSuccess(event: any) {
    if(this.selectedScheduleDate)
      this.getSchedule( this.selectedScheduleDate);
  }

  onScheduleClick(schedule:AircraftSchedule){
    this.updateSchedule.emit(schedule);
  }

}
