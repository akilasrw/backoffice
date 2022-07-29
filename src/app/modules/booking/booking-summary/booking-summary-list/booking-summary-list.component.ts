import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking-summary-list',
  templateUrl: './booking-summary-list.component.html',
  styleUrls: ['./booking-summary-list.component.scss']
})
export class BookingSummaryListComponent implements OnInit {

  isLoading:boolean=false;
  filterFormHasValue:boolean=false;
  flightNumber?: string;
  flightDate?: string;
  constructor() { }

  ngOnInit(): void {
  }

  onChangeFilterFrm(event: any) {
    // if ((this.airportName !== undefined && this.airportName !== "") ||
    //   (this.countryName !== undefined && this.countryName !== "") ||
    //   (this.airportCode !== undefined && this.airportCode !== "")
    // ) {
    //   this.filterFormHasValue = true;
    // } else {
    //   this.filterFormHasValue = false;
    // }
  }

  getFlightList(){

  }

  clearFilter(){

  }
}
