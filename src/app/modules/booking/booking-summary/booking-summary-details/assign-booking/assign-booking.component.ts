import { Component, Input, OnInit } from '@angular/core';
import { CargoBookingListQuery } from 'src/app/_models/queries/cargo-bookings/cargo-booking-list-query.model';
import { CargoBookingSummaryDetail } from 'src/app/_models/view-models/booking-summary/cargo-booking-summary-detail.model';
import { CargoBookingUld } from 'src/app/_models/view-models/booking-summary/cargo-booking-uld.model';
import { BookingService } from 'src/app/_services/booking.service';

@Component({
  selector: 'app-assign-booking',
  templateUrl: './assign-booking.component.html',
  styleUrls: ['./assign-booking.component.scss']
})
export class AssignBookingComponent implements OnInit {

  @Input() bookingDetail?: CargoBookingSummaryDetail;
  query: CargoBookingListQuery = new CargoBookingListQuery();
  cargoBookings?: CargoBookingUld[] =[];

  constructor(private bookingService:BookingService) { }

  ngOnInit(): void {
    if(this.bookingDetail)
      this.getList();
  }

  getList() {
    this.query.flightNumber = this.bookingDetail?.flightNumber;
    this.query.flightDate = this.bookingDetail?.scheduledDepartureDateTime;
    this.bookingService.getFreighterBookingList(this.query).subscribe(
      {
        next: (res) => {
          this.cargoBookings = res;
          console.log('getFreighterBookingList',res);
        },
        error: () => {
          this.cargoBookings = [];
        }
      }
    )
  }

  save() {

  }

}
