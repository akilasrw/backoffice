import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CargoBookingListQuery } from 'src/app/_models/queries/cargo-bookings/cargo-booking-list-query.model';
import { CargoBookingStatusUpdateListRm } from 'src/app/_models/view-models/cargo-bookings/cargo-booking-status-update-list-rm.model';
import { CargoBookingStatusUpdateRm } from 'src/app/_models/view-models/cargo-bookings/cargo-booking-status-update-rm.model';
import { CargoBooking } from 'src/app/_models/view-models/cargo-bookings/cargo-booking.model';
import { BookingService } from 'src/app/_services/booking.service';
import { VerifyInputBase, VerifyStatus } from 'src/app/core/enums/common-enums';
import { NumberExtension } from 'src/app/core/extensions/number-extension.model';

@Component({
  selector: 'app-verify-booking',
  templateUrl: './verify-booking.component.html',
  styleUrls: ['./verify-booking.component.scss']
})
export class VerifyBookingComponent implements OnInit {

  cargoBookingList: CargoBooking[] = [];
  query: CargoBookingListQuery = new CargoBookingListQuery();
  flightScheduleIdInput!: string;
  isActualButtonDisabled: boolean = true;
  isOffloadButtonDisabled: boolean = true;
  actualBookingCount: number = 0;
  offloadBookingCount: number = 0;
  verifyStatus = VerifyStatus;
  isDisabledButton: boolean = false;

  @Output() closePopup = new EventEmitter<any>();
  @Output() submitSuccess = new EventEmitter<any>();

  @Input() inputBase: VerifyInputBase = VerifyInputBase.None;

  @Input() set flightScheduleId(flightScheduleId: string) {
    this.flightScheduleIdInput = flightScheduleId;
    this.getBookingList();
  }

  constructor(private bookingService: BookingService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  getBookingList() {
    // this.query.flightNumber = this.cargoBookingSummary?.flightNumber;
    // this.query.flightDate = this.cargoBookingSummary?.scheduledDepartureDateTime;
    this.bookingService.getVerifyBookingList(this.flightScheduleIdInput).subscribe(
      {
        next: (res) => {
          this.cargoBookingList = res;
          this.checkVerifiedAll();
          this.setDefaultVerifyStatus(); debugger
          if(this.inputBase == VerifyInputBase.FromHistory) {
            this.isDisabledButton = true;
          }

        },
        error: () => {
          this.cargoBookingList = [];
        }
      }
    )
  }

  convertcm3Tom3(volume: number): number {
    return NumberExtension.convertcm3Tom3(volume);
  }

  selectedBooking(event: any, booking: CargoBooking) { ;
    //if(event.target.checked == true) this.isCancelButtonDisabled = false;
    //this.enableButtons();
  }

  enableButtons() {

  }

  checkVerifiedAll() { debugger;
    if(this.cargoBookingList.filter(x=>x.verifyStatus != VerifyStatus.None).length > 0 || this.cargoBookingList.length == 0)
      this.isDisabledButton = true;
  }

  setDefaultVerifyStatus() {
    if(this.cargoBookingList.length > 0) {
      this.cargoBookingList
      .forEach(v=> {
        if(v.verifyStatus == VerifyStatus.None) {
          v.selected = true;
          v.verifyStatus = VerifyStatus.ActualLoad;
          v.newRecord = true;
        } else {
          v.selected = true;
          v.newRecord = false;
        }
      });
    } console.log('setDefaultVerifyStatus',this.cargoBookingList)
    this.calcuculateCount();
  }

  setBooking(verifyStatus: VerifyStatus) {
    this.cargoBookingList.filter(x=>x.selected).forEach(v=>{
      v.verifyStatus = verifyStatus,
      v.newRecord = true;
    });
    this.calcuculateCount();
  }

  calcuculateCount(){
    this.actualBookingCount= this.cargoBookingList.filter(x=>x.verifyStatus == this.verifyStatus.ActualLoad && x.selected).length;
    this.offloadBookingCount = this.cargoBookingList.filter(x=>x.verifyStatus == this.verifyStatus.OffLoad && x.selected).length;
  }

  save() {
    console.log('VerifyBookingComponent - save', this.cargoBookingList);
    var rm: CargoBookingStatusUpdateListRm = new CargoBookingStatusUpdateListRm();
    rm.cargoBookingStatusUpdateList =[];

    this.cargoBookingList.filter(x=>x.selected && x.newRecord).forEach(v=>{
      var bookingItem: CargoBookingStatusUpdateRm = new CargoBookingStatusUpdateRm();
      bookingItem.VerifyStatus = v.verifyStatus;
      bookingItem.id = v.id;
      rm.cargoBookingStatusUpdateList?.push(bookingItem);
    });

    this.bookingService.updateStandByStatus(rm)
    .subscribe({
      next: (res) => {
        this.toastr.success('Verified Successfully.');
        this.closeModal();
        this.submitSuccess.emit();
        // this.getBookingList();
      },
      error: () => {
      }
    });
  }

  closeModal() {
    this.closePopup.emit();
  }
}
