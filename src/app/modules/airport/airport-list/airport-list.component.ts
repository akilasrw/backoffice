import { Airport } from 'src/app/_models/view-models/airports/airport.model';
import { AirportService } from 'src/app/_services/airport.service';
import { Component, OnInit } from '@angular/core';
import { AirportFilterQuery } from 'src/app/_models/queries/airport/airport-filter-query.model';
import { CommonMessages } from 'src/app/core/constants/common-messages';
import { ToastrService } from 'ngx-toastr';

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
  filterFormHasValue = false;
  modalVisibleDelete = false;
  modalVisibleAnimateDelete = false;
  selectedDeletedID?: string;
  selectedAirport?:Airport;


  constructor(private airpotService: AirportService, private toastr: ToastrService) { }

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
    this.airportName = undefined;
    this.countryName = undefined;
    this.airportCode = undefined;
    this.filterFormHasValue = false;
  }

  public onPageChanged(event: any) {
    if (this.airportFilterQuery?.pageIndex !== event) {
      this.airportFilterQuery.pageIndex = event;
      this.getAirportList();
    }
  }

  addAirport() {
    this.selectedAirport=undefined;
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  onEdit(airport: Airport){
    this.selectedAirport=airport;
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  closeAddAirport() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }
  onAirportAdd() {
    this.getAirportList();
  }

  onDelete(airportId: string) {
    this.selectedDeletedID = airportId;
    this.showDelete();
  }

  showDelete() {
    this.modalVisibleDelete = true;
    setTimeout(() => (this.modalVisibleAnimateDelete = true));
  }

  cancelDelete() {
    this.selectedDeletedID = '';
    this.modalVisibleAnimateDelete = false;
    setTimeout(() => (this.modalVisibleDelete = false), 300);
  }

  deleteAirport() {
    if (this.selectedDeletedID) {
      this.airpotService.deleteAirport(this.selectedDeletedID)
        .subscribe({
          next: (res) => {
            this.toastr.success(CommonMessages.DeletedSuccessMsg);
            this.cancelDelete();
            this.airports = [];
            this.getAirportList();
          },
          error: (error) => {
            this.toastr.error(CommonMessages.DeleteFailMsg);
            this.cancelDelete();
          }
        });
    }
  }
}
