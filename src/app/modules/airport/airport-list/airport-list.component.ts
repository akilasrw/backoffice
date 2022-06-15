import { Airport } from './../../../_models/view-models/Airport/airport.model';
import { AirportService } from './../../../_services/airport.service';
import { Component, OnInit } from '@angular/core';
import { AirportFilterQuery } from 'src/app/_models/queries/airport/airport-filter-query.model';

@Component({
  selector: 'app-airport-list',
  templateUrl: './airport-list.component.html',
  styleUrls: ['./airport-list.component.scss']
})
export class AirportListComponent implements OnInit {

  airports: Airport[] = [];
  totalCount: number = 0;
  airportFilterQuery: AirportFilterQuery = new AirportFilterQuery();
  airportName?: string;
  airportCode?: string;
  countryName?: string;
  modalVisible = false;
  modalVisibleAnimate = false;
  filterFormHasValue = true;

  constructor(private airpotService: AirportService) { }

  ngOnInit(): void {
    this.getAirportList();
  }

  getAirportList() {
    this.airportFilterQuery.airportName = this.airportName;
    this.airportFilterQuery.airportCode = this.airportCode;
    this.airportFilterQuery.countryName = this.countryName;
    this.airportFilterQuery.isCountryInclude = true;
    this.airpotService.getFilteredList(this.airportFilterQuery).subscribe(
      {
        next: (res) => {
          this.airports = res.data
          this.totalCount = res.count
        },
        error: (error) => {
          this.totalCount = 0;
          this.airports = []
        }
      }
    )
  }

  onChangeFilterFrm(event: any) {
    if ((this.airportName !== undefined && this.airportName !== "") ||
      (this.countryName !== undefined && this.countryName !== "") ||
      (this.airportCode !== undefined && this.airportCode !== "")
    ) {
      this.filterFormHasValue = true;
    } else {
      this.filterFormHasValue = false;
    }
  }

  clearFilter() {
    this.airportName=undefined;
    this.countryName=undefined;
    this.airportCode=undefined;
    this.filterFormHasValue = false;
  }

  public onPageChanged(event: any) {
    if (this.airportFilterQuery?.pageIndex !== event) {
      this.airportFilterQuery.pageIndex = event;
      this.getAirportList();
    }
  }

  addAirport() {
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  closeAddAirport() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }
  onAirportAdd(){
    this.getAirportList();
  }
}
