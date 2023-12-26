import { ToastrService } from 'ngx-toastr';
import { CargoPositionDetail } from './../../../../../_models/view-models/booking-summary/cargo-position-detail.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AircraftSubTypes, BookingStatus } from 'src/app/core/enums/common-enums';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { BookingSummaryDetailQuery } from 'src/app/_models/queries/booking-summary/booking-summary-detail-query.model';
import { CargoBookingSummaryDetail } from 'src/app/_models/view-models/booking-summary/cargo-booking-summary-detail.model';
import { BookingSummaryService } from 'src/app/_services/booking-summary.service';
import { NumberExtension } from 'src/app/core/extensions/number-extension.model';
import { CargoBooking } from 'src/app/_models/view-models/cargo-bookings/cargo-booking.model';
import { CargoBookingListQuery } from 'src/app/_models/queries/cargo-bookings/cargo-booking-list-query.model';
import { BookingService } from 'src/app/_services/booking.service';
import { CargoBookingStatusUpdateListRm } from 'src/app/_models/view-models/cargo-bookings/cargo-booking-status-update-list-rm.model';
import { CargoBookingStatusUpdateRm } from 'src/app/_models/view-models/cargo-bookings/cargo-booking-status-update-rm.model';
import { CargoBookingUpdateRm } from 'src/app/_models/view-models/cargo-bookings/cargo-booking-update-rm.model';

@Component({
  selector: 'app-freighter-booking-summary-detail-v2',
  templateUrl: './freighter-booking-summary-detail-v2.component.html',
  styleUrls: ['./freighter-booking-summary-detail-v2.component.scss']
})
export class FreighterBookingSummaryDetailV2Component implements OnInit {

  cargoBookingSummary?: CargoBookingSummaryDetail;
  selectedCargoPosition?: CargoPositionDetail;
  selectedPositionNumber:number=0;
  modalVisible = false;
  modalVisibleAnimate = false;
  assignBookingModalVisible = false;
  assignBookingModalVisibleAnimate = false;
  uldDetailModalVisible = false;
  uldDetailModalVisibleAnimate = false;
  bookingDetailModalVisible = false;
  bookingDetailModalVisibleAnimate = false;
  flightScheduleId?: string;
  cargoBookingList: CargoBooking[] = [];
  query: CargoBookingListQuery = new CargoBookingListQuery();
  bookingStatus = BookingStatus;
  isCancelButtonDisabled: boolean = true;
  isStandByButtonDisabled: boolean = true;
  isOffloadButtonDisabled: boolean = true;
  selectAllCheckBoxHidden: boolean = true;

  constructor(private activatedRoute: ActivatedRoute,
    private bookingSummaryService: BookingSummaryService,
    private router: Router,
    private bookingService: BookingService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getId();
  }

  getId() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.flightScheduleId = id;
        this.getSummaryDetail();
      }
    });
  }

  getSummaryDetail() {
    var bookingSummaryQuery: BookingSummaryDetailQuery = new BookingSummaryDetailQuery();
    bookingSummaryQuery.isIncludeAircraftType = true;
    bookingSummaryQuery.isIncludeFlightScheduleSectors = true;
    bookingSummaryQuery.id = this.flightScheduleId;
    this.bookingSummaryService.getBookingSummaryDetail(bookingSummaryQuery).subscribe({
      next: (res) => {
        this.cargoBookingSummary = res;

        if(res)
          this.getBookingList();
      },
      error: (error) => {

      }
    });
  }

  get aircraftSubTypes(): typeof AircraftSubTypes {
    return AircraftSubTypes;
  }

  GetAircraftConfigType(type: number) {
    return CoreExtensions.GetAircraftConfigType(type);
  }

  backToList() {
    this.router.navigate(['booking-summary']);
  }

  closebookingDetail(){
    this.bookingDetailModalVisibleAnimate = false;
    setTimeout(() => (this.bookingDetailModalVisible = false), 300);
  }

  closeAssginBooking() {
    this.assignBookingModalVisibleAnimate = false;
    setTimeout(() => (this.assignBookingModalVisible = false), 300);
  }


  convertcm3Tom3(volume: number): number {
    return NumberExtension.convertcm3Tom3(volume);
  }

  viewBookingdetail(): void {
    this.bookingDetailModalVisible = true;
    setTimeout(() => (this.bookingDetailModalVisibleAnimate = true));
  }

  viewAssignBooking(){
    this.assignBookingModalVisible = true;
    setTimeout(() => (this.assignBookingModalVisibleAnimate = true));
  }


  getBookingList() {
    this.query.flightNumber = this.cargoBookingSummary?.flightNumber;
    this.query.flightDate = this.cargoBookingSummary?.scheduledDepartureDateTime;
    this.bookingService.getBookingList(this.query).subscribe(
      {
        next: (res) => {
          this.cargoBookingList = res;
          console.log('Booking Detail',res);
          this.enableDisableSelectAllCheckBox();
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

  selectedBooking(event: any, booking: CargoBooking) {
    if(event.target.checked == true) this.isCancelButtonDisabled = false;
    this.enableButtons();
  }

  enableButtons() {
    var anySelected = this.cargoBookingList.filter(x=> x.selected);
    if(anySelected == undefined || anySelected?.length == 0) {
      this.isCancelButtonDisabled = true;
      this.isStandByButtonDisabled = true;
      this.isOffloadButtonDisabled = true;
    }

    var selectedBookedBookings = this.cargoBookingList.filter(x=> x.bookingStatus == BookingStatus.Booking_Made && x.selected);
    var selectedRecBookings = this.cargoBookingList.filter(x=> x.bookingStatus == BookingStatus.Cargo_Received && x.selected);

    if(selectedBookedBookings.length > 0 && selectedRecBookings.length == 0) {
      this.isStandByButtonDisabled = false;
      this.isCancelButtonDisabled = false;
      this.isOffloadButtonDisabled = true;
    }
    else if(selectedBookedBookings.length == 0 && selectedRecBookings.length > 0) {
      this.isOffloadButtonDisabled = false;
      this.isCancelButtonDisabled = false;
      this.isStandByButtonDisabled = true;
    } else if (selectedBookedBookings.length > 0 && selectedRecBookings.length > 0){
      this.isStandByButtonDisabled = true;
      this.isOffloadButtonDisabled = true;
      this.isCancelButtonDisabled = false;
    }
  }

  enableDisableSelectAllCheckBox() {
    var bookedBookings = this.cargoBookingList.filter(x=> x.bookingStatus == BookingStatus.Booking_Made);
    var recBookings = this.cargoBookingList.filter(x=> x.bookingStatus == BookingStatus.Cargo_Received);

    if(bookedBookings.length > 0 && recBookings.length == 0) {
      this.selectAllCheckBoxHidden = false;
    }
    else if(bookedBookings.length == 0 && recBookings.length > 0) {
      this.selectAllCheckBoxHidden = false;
    } else {
      this.selectAllCheckBoxHidden = true;
    }
  }

  selectDeselectAll(event: any) {
    var selected = false;
    if(event.target.checked == true) {
      selected = true;
    }

    this.cargoBookingList.forEach(book=> {
      book.selected = selected;
    });

    this.enableButtons();
  }


  cancelBookings() {
    var list: CargoBookingUpdateRm[]=[];
    var bookings = this.cargoBookingList
    .filter(x=>x.selected == true)
    .forEach(book=>{
      var cargoBookingUpdateRm: CargoBookingUpdateRm = new CargoBookingUpdateRm();
      cargoBookingUpdateRm.id = book.id;
      cargoBookingUpdateRm.bookingStatus = 70;
      list.push(cargoBookingUpdateRm);
    });

    if(list.length > 0 ) {
      this.bookingService.updateDeleteCargo(list)
      .subscribe({
        next: (res) => {
          this.toastr.success('Cancelled Successfully.');
          this.getBookingList();
        },
        error: () => {
        }
      });
    }
  }

  moveToStabdBy() {
    var rm = this.mappingList(1);
    this.update(rm);
  }

  moveToOffload() {
    var rm = this.mappingList(2);
    this.update(rm);
  }

  update(rm: CargoBookingStatusUpdateListRm){
    this.bookingService.updateStandByStatus(rm)
    .subscribe({
      next: (res) => {
        this.toastr.success('Saved Successfully.');
        this.getBookingList();
      },
      error: () => {
      }
    });
  }

  mappingList(status: number) {
    var rm = new CargoBookingStatusUpdateListRm();
    rm.cargoBookingStatusUpdateList =[];
    this.cargoBookingList.filter(x=>x.selected == true).forEach(book=>{
      var cargoBookingStatusUpdateRm: CargoBookingStatusUpdateRm = new CargoBookingStatusUpdateRm();
      cargoBookingStatusUpdateRm.id = book.id;
      cargoBookingStatusUpdateRm.standByStatus = status;
      rm.cargoBookingStatusUpdateList?.push(cargoBookingStatusUpdateRm)
    });
    rm.standByStatus = status;
    return rm;
  }


}
