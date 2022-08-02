import { Component, OnInit } from '@angular/core';
import { BookingSummaryType } from 'src/app/core/enums/common-enums';
import { BookingSummaryQuery } from 'src/app/_models/queries/booking-summary/booking-summary-query.model';
import { CargoBookingSummaryDetail } from 'src/app/_models/view-models/booking-summary/cargo-booking-summary-detail.model';
import { BookingSummaryService } from 'src/app/_services/booking-summary.service';

@Component({
  selector: 'app-booking-summary-details',
  templateUrl: './booking-summary-details.component.html',
  styleUrls: ['./booking-summary-details.component.scss']
})
export class BookingSummaryDetailsComponent implements OnInit {


  bookingSummaryQuery: BookingSummaryQuery = new BookingSummaryQuery();
  cargoBookingSummary!: CargoBookingSummaryDetail;
  bookingSummaryType : BookingSummaryType = BookingSummaryType.OnSeat;

  constructor(private bookingSummaryService: BookingSummaryService) { }

  ngOnInit(): void {
    this.find();
  }


  find() {
    this.bookingSummaryService
    .getSummary(this.bookingSummaryQuery)
    .subscribe({
      next: (res) => {
        this.cargoBookingSummary = res;
        console.log(res);
        
        },
        error: (error) => {

        }
      }
    )
  }

}
