import { Component, Input, OnInit } from '@angular/core';
import { CargoPositionDetail } from 'src/app/_models/view-models/booking-summary/cargo-position-detail.model';
import { UldContainerCargoPosition } from 'src/app/_models/view-models/booking-summary/uld-container-cargo-position.model';
import { CargoBooking } from 'src/app/_models/view-models/cargo-bookings/cargo-booking.model';
import { BookingSummaryService } from 'src/app/_services/booking-summary.service';

@Component({
  selector: 'app-freighter-uld-details',
  templateUrl: './freighter-uld-details.component.html',
  styleUrls: ['./freighter-uld-details.component.scss']
})
export class FreighterUldDetailsComponent implements OnInit {

  @Input() positionDetail: CargoPositionDetail = new CargoPositionDetail();
  cargoBookingList: CargoBooking[] = [];

  constructor(private bookingSummaryService: BookingSummaryService) { }

  ngOnInit(): void {
    if(this.positionDetail != null){
      this.getULDBookingList();
    }
    
  }

  getULDBookingList() {
    let query = new UldContainerCargoPosition();
    query.cargoPositionId = this.positionDetail.id;
    // query.uLDContainerId = cargoPackage.uldContainerId;
    this.bookingSummaryService.getULDBookingList(query).subscribe(
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

}
