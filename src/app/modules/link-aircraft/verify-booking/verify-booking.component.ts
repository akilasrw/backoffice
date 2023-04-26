import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CargoBookingListQuery } from 'src/app/_models/queries/cargo-bookings/cargo-booking-list-query.model';
import { CargoBooking } from 'src/app/_models/view-models/cargo-bookings/cargo-booking.model';
import { BookingService } from 'src/app/_services/booking.service';

@Component({
  selector: 'app-verify-booking',
  templateUrl: './verify-booking.component.html',
  styleUrls: ['./verify-booking.component.scss']
})
export class VerifyBookingComponent implements OnInit {

  cargoBookingList: CargoBooking[] = [];
  query: CargoBookingListQuery = new CargoBookingListQuery();

  constructor(private bookingService: BookingService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  getBookingList() {
    // this.query.flightNumber = this.cargoBookingSummary?.flightNumber;
    // this.query.flightDate = this.cargoBookingSummary?.scheduledDepartureDateTime;
    this.bookingService.getBookingList(this.query).subscribe(
      {
        next: (res) => {
          this.cargoBookingList = res;
        },
        error: () => {
          this.cargoBookingList = [];
        }
      }
    )
  }

}
