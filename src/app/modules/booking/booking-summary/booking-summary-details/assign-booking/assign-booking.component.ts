import { UldContainerCargoPosition } from './../../../../../_models/view-models/booking-summary/uld-container-cargo-position.model';
import { ToastrService } from 'ngx-toastr';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CargoBookingListQuery } from 'src/app/_models/queries/cargo-bookings/cargo-booking-list-query.model';
import { CargoBookingSummaryDetail } from 'src/app/_models/view-models/booking-summary/cargo-booking-summary-detail.model';
import { CargoBookingUld } from 'src/app/_models/view-models/booking-summary/cargo-booking-uld.model';
import { BookingService } from 'src/app/_services/booking.service';
import {PositionPipe } from 'src/app/core/pipes/position.pipe'
import { BookingSummaryService } from 'src/app/_services/booking-summary.service';

@Component({
  selector: 'app-assign-booking',
  templateUrl: './assign-booking.component.html',
  styleUrls: ['./assign-booking.component.scss']
})
export class AssignBookingComponent implements OnInit {

  @Input() bookingDetail?: CargoBookingSummaryDetail;
  query: CargoBookingListQuery = new CargoBookingListQuery();
  cargoBookings?: CargoBookingUld[] =[];
  selectedPosition: any;
  @Output() submitSuccess = new EventEmitter();

  constructor(private bookingService:BookingService,
    private bookingSummaryService: BookingSummaryService,
    private toast: ToastrService) { }

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
          console.log('bookingDetail',this.bookingDetail);

        },
        error: () => {
          this.cargoBookings = [];
        }
      }
    )
  }

  save(cargoPackage: any) {
    console.log(this.selectedPosition);
    console.log(cargoPackage);
    if(cargoPackage.cargoPositionId == "00000000-0000-0000-0000-000000000000") {
      this.toast.warning('Please select the pallet.');
    } else {debugger
      let cargo = new UldContainerCargoPosition();
      cargo.cargoPositionId = cargoPackage.cargoPositionId;
      cargo.uLDContainerId = cargoPackage.uldContainerId;
      cargo.volume = cargoPackage.height*cargoPackage.length*cargoPackage.width;
      cargo.weight = cargoPackage.weight;
      this.bookingSummaryService.assignCargoToUld(cargo).subscribe({
        next: (res) => {
          this.toast.success('Added Successfully.');
          this.submitSuccess.emit();
        },
        error: (err) => {
        }
      });

    }
  }
}
