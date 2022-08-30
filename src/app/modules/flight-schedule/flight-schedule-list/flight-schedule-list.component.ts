import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flight-schedule-list',
  templateUrl: './flight-schedule-list.component.html',
  styleUrls: ['./flight-schedule-list.component.scss']
})
export class FlightScheduleListComponent implements OnInit {

  modalVisible = false;
  modalVisibleAnimate = false;

  constructor() { }

  ngOnInit(): void {
  }

  openAddFlightSchedule() {
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }


  closeAddFlightSchedule() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

}
