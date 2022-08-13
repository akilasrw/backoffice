import { CargoBookingSummaryDetail } from './../../../../../_models/view-models/booking-summary/cargo-booking-summary-detail.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking-summary-lir',
  templateUrl: './booking-summary-lir.component.html',
  styleUrls: ['./booking-summary-lir.component.scss']
})
export class BookingSummaryLirComponent implements OnInit {

  @Input() cargoBookingSummary: CargoBookingSummaryDetail = new CargoBookingSummaryDetail();

  constructor() {

  }

  ngOnInit(): void {

  }

}
