import { FlightSchedule } from './../../../_models/view-models/flight-schedules/flight-schedule';
import { FlightScheduleService } from './../../../_services/flight-schedule.service';
import { AirportService } from './../../../_services/airport.service';
import { Component, OnInit } from '@angular/core';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { FlightScheduleFilterQuery } from 'src/app/_models/queries/flight-schedule/flight-schedule-filter-query.model';

@Component({
  selector: 'app-flight-schedule-list',
  templateUrl: './flight-schedule-list.component.html',
  styleUrls: ['./flight-schedule-list.component.scss']
})
export class FlightScheduleListComponent implements OnInit {

  modalVisible = false;
  modalVisibleAnimate = false;
  flightNumber?: string;
  filterFormHasValue:boolean=false;
  originAirpots: SelectList[] = [];
  destinationAirpots: SelectList[] = [];
  originAirportId?: string;
  destinationAirportId?: string;
  keyword = 'value';
  isLoading:boolean=false;
  flightScheduleFilterQuery: FlightScheduleFilterQuery = new FlightScheduleFilterQuery();
  totalCount: number = 0;
  flightSchedule: FlightSchedule[] = [];


  constructor(private airportService:AirportService,
    private flightScheduleService:FlightScheduleService) { }

  ngOnInit(): void {
    this.loadAirports();
    this.getFlightScheduleList();
  }

  loadAirports() {
    this.isLoading=true;
    this.airportService.getSelectList()
      .subscribe(res => {
        if (res.length > 0) {
          this.originAirpots = res;
          Object.assign(this.destinationAirpots, res);
        }
        this.isLoading=false;
      });
  }

  getFlightScheduleList(){
    this.isLoading=true;
    this.flightScheduleFilterQuery.flightNumber = this.flightNumber;
    this.flightScheduleFilterQuery.originAirportId = this.originAirportId;
    this.flightScheduleFilterQuery.destinationAirportId = this.destinationAirportId;
    this.flightScheduleService.getFilteredList(this.flightScheduleFilterQuery).subscribe(
      {
        next: (res) => {
          this.flightSchedule = res.data;
          this.totalCount = res.count;
          this.isLoading=false;
        },
        error: (error) => {
          this.totalCount = 0;
          this.flightSchedule = [];
          this.isLoading=false;
        }
      }
    );
  }

  openAddFlightSchedule() {
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }


  closeAddFlightSchedule() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  clearFilter() {
    this.flightNumber = undefined;
    this.onClearOrigin();
    this.onClearDestination();
    this.filterFormHasValue = false;
  }

  onChangeFilterFrm(event: any) {
    if (this.flightNumber !== undefined && this.flightNumber !== "") {
      this.filterFormHasValue = true;
    } else {
      this.filterFormHasValue = false;
    }
  }

  selectedOrigin(value: any) {
    this.originAirportId = value.id;
  }

  onClearOrigin(){
    this.originAirportId = undefined;
  }

  selectedDestination(value: any) {
    this.destinationAirportId = value.id;
  }

  onClearDestination(){
    this.destinationAirportId = undefined;
  }

}
