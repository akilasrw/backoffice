import { Component, OnInit } from '@angular/core';
import { BookingSummaryQuery } from 'src/app/_models/queries/booking-summary/booking-summary-query.model';
import { CargoBookingSummary } from 'src/app/_models/view-models/booking-summary/cargo-booking-summary.model';
import { BookingSummaryService } from 'src/app/_services/booking-summary.service';

@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.scss']
})
export class BookingSummaryComponent implements OnInit {

  bookingSummaryQuery: BookingSummaryQuery = new BookingSummaryQuery();
  cargoBookingSummary!: CargoBookingSummary;

  constructor(private bookingSummaryService: BookingSummaryService) { }

  ngOnInit(): void {
  }


  find() {
    this.bookingSummaryService
    .getSummary(this.bookingSummaryQuery)
    .subscribe({
      next: (res) => {
        this.cargoBookingSummary = res;
        },
        error: (error) => {

        }
      }
    )
  }
}
