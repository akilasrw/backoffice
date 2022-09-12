import { AutoCompleteDropdownComponent } from './../../../shared/components/forms/auto-complete-dropdown/auto-complete-dropdown.component';
import { SelectList } from './../../../shared/models/select-list.model';
import { Flight } from './../../../_models/view-models/flight/flight.model';
import { FlightService } from 'src/app/_services/flight.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FlightFilterQuery } from 'src/app/_models/queries/flight/flight-filter-query.model';
import { AirportService } from 'src/app/_services/airport.service';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.scss']
})
export class FlightListComponent implements OnInit {

  modalVisible = false;
  modalVisibleAnimate = false;
  flightFilterQuery: FlightFilterQuery = new FlightFilterQuery();
  isLoading :boolean= false;
  flights :Flight[]=[];
  totalCount: number = 0;
  isFiltered: boolean = false;
  keyword = 'value';
  originAirpots: SelectList[] = [];
  destinationAirpots: SelectList[] = [];

  @ViewChild('originAirportAutoComplete') originAirportDropdown!: AutoCompleteDropdownComponent;
  @ViewChild('destinationAirportAutoComplete') destinationAirportDropdown!: AutoCompleteDropdownComponent;

  constructor(private flightService: FlightService,
    private airportService: AirportService) { }

  ngOnInit(): void {
    this.loadAirports();
    this.getFlightList();
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

  openAddFlight() {
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }


  closeAddFlight() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  getFlightList() {
    this.isLoading=true;
    this.flightService.getFilteredList(this.flightFilterQuery).subscribe(
      {
        next: (res) => {
          console.log(res);
          this.flights = res.data;
          this.totalCount = res.count;
          this.isLoading = false;
        },
        error: (error) => {
          this.totalCount = 0;
          this.flights = [];
          this.isLoading = false;
        }
      }
    );
  }

  clearFiltered() {
    this.flightFilterQuery = new FlightFilterQuery();
    this.getFlightList();
    this.isFiltered= false;
    this.originAirportDropdown.clear()
    this.destinationAirportDropdown.clear()
  }

  onChangeFilter() {
    this.isFiltered= true;
    if(this.flightFilterQuery.flightNumber == '' &&
    this.flightFilterQuery.originAirportId == '' &&
    this.flightFilterQuery.destinationAirportId == ''){
      this.isFiltered = false;
    }
  }

  selectedOrigin(value: any) {
    this.flightFilterQuery.originAirportId = value.id;
    this.onChangeFilter();
  }

  onClearOrigin(){
    this.flightFilterQuery.originAirportId = undefined;
  }

  selectedDestination(value: any) {
    this.flightFilterQuery.destinationAirportId = value.id;
    this.onChangeFilter();
  }

  onClearDestination(){
    this.flightFilterQuery.destinationAirportId = undefined;
  }

  onFlightAdd() {
    this.getFlightList();
  }

}
