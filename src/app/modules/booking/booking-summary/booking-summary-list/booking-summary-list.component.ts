import { CargoBookingSummary } from './../../../../_models/view-models/booking-summary/cargo-booking-summary.model';
import { Component, OnInit } from '@angular/core';
import { BookingSummaryService } from 'src/app/_services/booking-summary.service';
import { BookingSummaryFilterQuery } from 'src/app/_models/queries/booking-summary/booking-summary-filter-query.model';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { Router } from '@angular/router';

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
          this.bookingSummarys = res.data;
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

  clearFilter(){
    this.flightNumber=undefined;
    this.flightDate=undefined;
    this.filterFormHasValue = false;
  }

  GetAircraftConfigType(type: number) {
    return CoreExtensions.GetAircraftConfigType(type);
  }

  onViewDetail(item:any){
    this.router.navigate(['booking-summary/summaryDetails']);
  }
  
}
