import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CargoBookingListQuery } from 'src/app/_models/queries/cargo-bookings/cargo-booking-list-query.model';
import { CargoBooking } from 'src/app/_models/view-models/cargo-bookings/cargo-booking.model';
import { BookingService } from 'src/app/_services/booking.service';

@Component({
  selector: 'app-stand-by-cargo-master',
  templateUrl: './stand-by-cargo-master.component.html',
  styleUrls: ['./stand-by-cargo-master.component.scss']
})
export class StandByCargoMasterComponent implements OnInit {

  query: CargoBookingListQuery = new CargoBookingListQuery();
  cargoBookingList: CargoBooking[] = [];
  selectedStandByStatus = 1;

  constructor(private bookingService: BookingService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  getBookingList() {
    this.query.standByStatus = this.selectedStandByStatus;
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
