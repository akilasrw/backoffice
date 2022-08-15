import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingSummaryType } from 'src/app/core/enums/common-enums';
import { BookingSummaryQuery } from 'src/app/_models/queries/booking-summary/booking-summary-query.model';
import { CargoBookingSummaryDetail } from 'src/app/_models/view-models/booking-summary/cargo-booking-summary-detail.model';
import { BookingSummaryService } from 'src/app/_services/booking-summary.service';

@Component({
  selector: 'app-p2c-booking-summary-details',
  templateUrl: './p2c-booking-summary-details.component.html',
  styleUrls: ['./p2c-booking-summary-details.component.scss']
})
export class P2cBookingSummaryDetailsComponent implements OnInit {

  bookingSummaryQuery: BookingSummaryQuery = new BookingSummaryQuery();
  cargoBookingSummary!: CargoBookingSummaryDetail;
  bookingSummaryType : BookingSummaryType = BookingSummaryType.OnSeat;

  constructor(private bookingSummaryService: BookingSummaryService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {
    this.getId();
  }

  getId() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.bookingSummaryQuery.flightScheduleId = id;
        this.getSummary();
      }
    });
  }

  getSummary() {
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

  backToList() {
    this.router.navigate(['booking-summary']);
  }

}
