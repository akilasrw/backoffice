import { UldContainerCargoPosition } from './../../../../../_models/view-models/booking-summary/uld-container-cargo-position.model';
import { ToastrService } from 'ngx-toastr';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CargoBookingListQuery } from 'src/app/_models/queries/cargo-bookings/cargo-booking-list-query.model';
import { CargoBookingSummaryDetail } from 'src/app/_models/view-models/booking-summary/cargo-booking-summary-detail.model';
import { CargoBookingUld } from 'src/app/_models/view-models/booking-summary/cargo-booking-uld.model';
import { BookingService } from 'src/app/_services/booking.service';
import {PositionPipe } from 'src/app/core/pipes/position.pipe'
import { BookingSummaryService } from 'src/app/_services/booking-summary.service';
import { PackageItem } from 'src/app/_models/view-models/booking-summary/package-item.model';

@Component({
  selector: 'app-assign-booking',
  templateUrl: './assign-booking.component.html',
  styleUrls: ['./assign-booking.component.scss']
})
export class AssignBookingComponent implements OnInit {

  @Input() bookingDetail?: CargoBookingSummaryDetail;
  query: CargoBookingListQuery = new CargoBookingListQuery();
  cargoBookings?: CargoBookingUld[] =[];
  displayCargoBookings?: CargoBookingUld[] =[];

  selectedPosition: any;
  @Output() submitSuccess = new EventEmitter();
  totalCount: number = 0;
  isLoading :boolean= false;

  constructor(private bookingService:BookingService,
    private bookingSummaryService: BookingSummaryService,
    private toast: ToastrService) { }

  ngOnInit(): void {
    if(this.bookingDetail)
      this.getList();
  }

  getList() {
    this.isLoading= true;
    this.query.flightNumber = this.bookingDetail?.flightNumber;
    this.query.flightDate = this.bookingDetail?.scheduledDepartureDateTime;
    this.bookingService.getFreighterBookingList(this.query).subscribe(
      {
        next: (res) => {
          this.cargoBookings = res;
          this.displayCargoBookings = this.cargoBookings.filter((item, i, arr) => arr.findIndex((t) => t.id === item.id) === i);
          this.isLoading= false;
          this.totalCount = this.cargoBookings.length;
        },
        error: () => {
          this.cargoBookings = [];
          this.displayCargoBookings=[];
          this.isLoading= false;
          this.totalCount =0;
        }
      }
    )
  }

  save(cargoPackage: any) {
    console.log(this.selectedPosition);
    console.log(cargoPackage);
    if(cargoPackage.cargoPositionId == "00000000-0000-0000-0000-000000000000") {
      this.toast.warning('Please select the pallet.');
    } else {
      this.bookingSummaryService.assignCargoToUld(this.getSectorWisePositionList(cargoPackage)).subscribe({
        next: (res) => {
          this.toast.success('Added Successfully.');
          this.submitSuccess.emit();
        },
        error: (err) => {
        }
      });
    }
  }

  getSectorWisePositionList(packageItem :PackageItem): UldContainerCargoPosition []{
    let uldContainerCargoPosition:UldContainerCargoPosition []=[];

    let selectedBooking = this.cargoBookings?.filter(b=>b.id==packageItem.cargoBookingId);

    selectedBooking?.forEach(b=>{
      b.packageItems?.forEach(p=>{
        if(p.id == packageItem.id){
          let cargo = new UldContainerCargoPosition();
          cargo.cargoPositionId = packageItem.cargoPositionId;
          cargo.uLDContainerId = p.uldContainerId;
          cargo.volume = p.height!*p.length!*p.width!;
          cargo.weight = p.weight;

          uldContainerCargoPosition.push(cargo);
        }
      });
    });
    return uldContainerCargoPosition;
  }

}
