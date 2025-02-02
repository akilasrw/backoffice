import { CargoBookingSummary } from './../../../../_models/view-models/booking-summary/cargo-booking-summary.model';
import { Component, OnInit } from '@angular/core';
import { BookingSummaryService } from 'src/app/_services/booking-summary.service';
import { BookingSummaryFilterQuery } from 'src/app/_models/queries/booking-summary/booking-summary-filter-query.model';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { Router } from '@angular/router';
import { AircraftConfigType } from 'src/app/core/enums/common-enums';
import { NumberExtension } from 'src/app/core/extensions/number-extension.model';

@Component({
  selector: 'app-booking-summary-list',
  templateUrl: './booking-summary-list.component.html',
  styleUrls: ['./booking-summary-list.component.scss']
})
export class BookingSummaryListComponent implements OnInit {

  isLoading:boolean=false;
  filterFormHasValue:boolean=false;
  flightNumber?: string;
  flightDate?: Date;
  totalCount: number = 0;
  bookingSummarys:CargoBookingSummary[]=[];
  bookingSummaryFilterQuery: BookingSummaryFilterQuery = new BookingSummaryFilterQuery();

  constructor(private bookingSummaryService:BookingSummaryService,private router: Router) { }

  ngOnInit(): void {
    this.getFilteredList();
  }

  onChangeFilterFrm(event: any) {
    if ((this.flightNumber !== undefined && this.flightNumber !== "") || (this.flightDate !== null))
    {
      this.filterFormHasValue = true;
    } else {
      this.filterFormHasValue = false;
    }
  }

  getFilteredList(){
    this.isLoading=true;
    this.bookingSummaryFilterQuery.flightNumber=this.flightNumber;
    this.bookingSummaryFilterQuery.flightDate=this.flightDate;

    this.bookingSummaryService.getFilteredList(this.bookingSummaryFilterQuery).subscribe(
      {
        next:(res)=>{
          this.bookingSummarys = res.data; console.log(res);

          this.totalCount = res.count;
          this.isLoading=false;
        },
        error:()=>{
          this.bookingSummarys = [];
          this.totalCount = 0;
          this.isLoading=false;
        }
      }
    )
  }

  public onPageChanged(event: any) {
    if (this.bookingSummaryFilterQuery?.pageIndex !== event) {
      this.bookingSummaryFilterQuery.pageIndex = event;
      this.getFilteredList();
    }
  }

  convertcm3Tom3(volume: number): number {
    return NumberExtension.convertcm3Tom3(volume);
  }

  clearFilter() {
    this.flightNumber=undefined;
    this.flightDate=undefined;
    this.filterFormHasValue = false;
  }

  GetAircraftConfigType(type: number) {
    return CoreExtensions.GetAircraftConfigType(type);
  }

  onViewDetail(item:CargoBookingSummary){
    if(item.aircraftConfigurationType === AircraftConfigType.P2C){
      this.router.navigate(['booking-summary/p2cSummaryDetails',item.id]);
    }else if(item.aircraftConfigurationType === AircraftConfigType.Freighter){
      this.router.navigate(['booking-summary/freighterSummaryDetails',item.id]);
    }
  }

}
