import { CargoBooking } from './../../../_models/view-models/cargo-bookings/cargo-booking.model';
import { Component, Input, OnInit } from '@angular/core';
import { CargoBookingSummaryDetail } from 'src/app/_models/view-models/booking-summary/cargo-booking-summary-detail.model';
import { BookingService } from 'src/app/_services/booking.service';
import { CargoBookingListQuery } from 'src/app/_models/queries/cargo-bookings/cargo-booking-list-query.model';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { BookingStatus } from 'src/app/core/enums/common-enums';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.scss']
})
export class BookingDetailComponent implements OnInit {

  @Input() bookingDetail?: CargoBookingSummaryDetail;
  cargoBookingList: CargoBooking[] = [];
  query: CargoBookingListQuery = new CargoBookingListQuery();
  bookingStatus = BookingStatus;

  constructor(private bookingService: BookingService,) { }

  ngOnInit(): void {
    if(this.bookingDetail)
      this.getList();
  }

  getList() {
    this.query.flightNumber = this.bookingDetail?.flightNumber;
    this.query.flightDate = this.bookingDetail?.scheduledDepartureDateTime;
    this.bookingService.getBookingList(this.query).subscribe(
      {
        next: (res) => {
          this.cargoBookingList = res;
          console.log('Booking Detail',res);
        },
        error: () => {
          this.cargoBookingList = [];
        }
      }
    )
  }

  getBookingStatus(status: number): string {
    return CoreExtensions.GetBookingStatus(status)
  }

  convertcm3Tom3(volume: number): number {
    return volume / 1000000;
  }
}
