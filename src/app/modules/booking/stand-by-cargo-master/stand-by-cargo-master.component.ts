import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CargoBookingListQuery } from 'src/app/_models/queries/cargo-bookings/cargo-booking-list-query.model';
import { CargoBooking } from 'src/app/_models/view-models/cargo-bookings/cargo-booking.model';
import { BookingService } from 'src/app/_services/booking.service';
import { BookingStatus, StandByCargoType } from 'src/app/core/enums/common-enums';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { NumberExtension } from 'src/app/core/extensions/number-extension.model';

@Component({
  selector: 'app-stand-by-cargo-master',
  templateUrl: './stand-by-cargo-master.component.html',
  styleUrls: ['./stand-by-cargo-master.component.scss']
})
export class StandByCargoMasterComponent implements OnInit {

  query: CargoBookingListQuery = new CargoBookingListQuery();
  cargoBookingList: CargoBooking[] = [];
  selectedStandByStatus = StandByCargoType;
  standByCargoType: StandByCargoType = StandByCargoType.Offload;
  bookingStatus = BookingStatus;
  updateStandByModalVisibleAnimate: boolean = false;
  updateStandByModalVisible: boolean = false;
  bookingId?: string;

  constructor(private bookingService: BookingService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getBookingList();
  }

  getBookingList() {
    this.query.standByStatus = Number(this.standByCargoType);
    this.bookingService.getstandByStatusList(this.query).subscribe(
      {
        next: (res) => {
          console.log('StandByCargo',res);
          this.cargoBookingList = res;
        },
        error: () => {
          this.cargoBookingList = [];
        }
      }
    )
  }

  changeMenu(type: StandByCargoType) {
    if(this.standByCargoType != type) {
      this.standByCargoType = type;
      this.getBookingList();
    }
  }

  getBookingStatus(status: number): string {
    return CoreExtensions.GetBookingStatus(status)
  }

  convertcm3Tom3(volume: number): number {
    return NumberExtension.convertcm3Tom3(volume);
  }

  closeUpdateStandBy(){
    this.updateStandByModalVisibleAnimate = false;
    setTimeout(() => (this.updateStandByModalVisible = false), 300);
  }

  onSubmitSuccess(event:any) {

  }

  showUpdate(val: any) {
    console.log('showUpdate',val);
    this.bookingId = val.id;
    this.updateStandByModalVisibleAnimate = true;
    this.updateStandByModalVisible = true;

  }

}
