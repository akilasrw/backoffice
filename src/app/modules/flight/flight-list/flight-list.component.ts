import { AutoCompleteDropdownComponent } from './../../../shared/components/forms/auto-complete-dropdown/auto-complete-dropdown.component';
import { SelectList } from './../../../shared/models/select-list.model';
import { Flight } from './../../../_models/view-models/flight/flight.model';
import { FlightService } from 'src/app/_services/flight.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FlightFilterQuery } from 'src/app/_models/queries/flight/flight-filter-query.model';
import { AirportService } from 'src/app/_services/airport.service';
import { CommonMessages } from 'src/app/core/constants/common-messages';
import { ToastrService } from 'ngx-toastr';

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
  modalVisibleDelete = false;
  modalVisibleAnimateDelete = false;
  selectedFlight?:string;
  selectedDeletedID?:string;

  @ViewChild('originAirportAutoComplete') originAirportDropdown!: AutoCompleteDropdownComponent;
  @ViewChild('destinationAirportAutoComplete') destinationAirportDropdown!: AutoCompleteDropdownComponent;

  constructor(private flightService: FlightService,
    private airportService: AirportService,
    private toastr: ToastrService) { }

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
    this.selectedFlight = undefined;
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

  onEdit(flight:Flight){
    this.selectedFlight = flight.id;
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  onDelete(id:string){
    this.selectedDeletedID = id;
    this.modalVisibleDelete = true;
    setTimeout(() => (this.modalVisibleAnimateDelete = true));
  }

  cancelDelete() {
    this.selectedDeletedID = '';
    this.modalVisibleAnimateDelete = false;
    setTimeout(() => (this.modalVisibleDelete = false), 300);
  }

  deleteFlight() {
    if (this.selectedDeletedID) {
      this.isLoading=true;
      this.flightService.deleteFlight(this.selectedDeletedID)
        .subscribe({
          next: (res) => {
            this.toastr.success(CommonMessages.DeletedSuccessMsg);
            this.cancelDelete();
            this.flights = [];
            this.isLoading=false;
            this.getFlightList();
          },
          error: (error) => {
            this.cancelDelete();
            this.isLoading=false;
          }
        });
    }
  }

  public onPageChanged(event: any) {
    if (this.flightFilterQuery?.pageIndex !== event) {
      this.flightFilterQuery.pageIndex = event;
      this.getFlightList();
    }
  }

}
