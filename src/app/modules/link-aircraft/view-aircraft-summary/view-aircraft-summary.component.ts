import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-view-aircraft-summary',
  templateUrl: './view-aircraft-summary.component.html',
  styleUrls: ['./view-aircraft-summary.component.scss']
})
export class ViewAircraftSummaryComponent implements OnInit {

  selectedFlightScheduleId!: string;
  @Input() set flightScheduleId(val: string) {
    this.selectedFlightScheduleId = val;
  }
  @Output() closePopup = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

}
