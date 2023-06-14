import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlightScheduleQuery } from 'src/app/_models/queries/flight-schedule/flight-schedule-query.model';
import { FlightScheduleLink } from 'src/app/_models/view-models/link-aircraft/flight-schedule-link.model';
import { FlightScheduleService } from 'src/app/_services/flight-schedule.service';

@Component({
  selector: 'app-view-aircraft-summary',
  templateUrl: './view-aircraft-summary.component.html',
  styleUrls: ['./view-aircraft-summary.component.scss']
})
export class ViewAircraftSummaryComponent implements OnInit {

  selectedFlightScheduleId!: string;
  flightScheduleLink: FlightScheduleLink= new FlightScheduleLink();
  @Input() set flightScheduleId(val: string) {
    this.selectedFlightScheduleId = val;
    this.loadSummary();
  }
  @Output() closePopup = new EventEmitter<any>();
  @Output() viewBookings = new EventEmitter<any>();

  constructor(private flightScheduleService: FlightScheduleService) { }

  ngOnInit(): void {
  }

  loadSummary() {
    if(this.selectedFlightScheduleId ) {
      var query: FlightScheduleQuery = new FlightScheduleQuery();
      query.includeFlightScheduleSectors = true;
      query.includeAircrafts = true;
      query.id = this.selectedFlightScheduleId;
      this.flightScheduleService.getFlightSchedule(query)
      .subscribe(res=> {
        this.flightScheduleLink = res;
      });
    }
  }

  viewBooking() {
    this.viewBookings.emit(this.flightScheduleLink.id)
  }

}
