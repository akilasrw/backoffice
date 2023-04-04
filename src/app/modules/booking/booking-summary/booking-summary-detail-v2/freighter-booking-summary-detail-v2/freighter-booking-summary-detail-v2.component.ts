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

  constructor(private activatedRoute: ActivatedRoute,
    private bookingSummaryService: BookingSummaryService,
    private router: Router,
    private bookingService: BookingService) { }

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


}
