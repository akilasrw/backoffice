import { CargoPositionDetail } from './../../../../../_models/view-models/booking-summary/cargo-position-detail.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AircraftSubTypes } from 'src/app/core/enums/common-enums';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { BookingSummaryDetailQuery } from 'src/app/_models/queries/booking-summary/booking-summary-detail-query.model';
import { CargoBookingSummaryDetail } from 'src/app/_models/view-models/booking-summary/cargo-booking-summary-detail.model';
import { BookingSummaryService } from 'src/app/_services/booking-summary.service';
import { NumberExtension } from 'src/app/core/extensions/number-extension.model';

@Component({
  selector: 'app-freighter-booking-summary-details',
  templateUrl: './freighter-booking-summary-details.component.html',
  styleUrls: ['./freighter-booking-summary-details.component.scss']
})
export class FreighterBookingSummaryDetailsComponent implements OnInit {

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

  constructor(private activatedRoute: ActivatedRoute, private bookingSummaryService: BookingSummaryService,private router: Router) { }

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

  viewLIR() {
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  closeLIR() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  closeULDDetail() {
    this.selectedCargoPosition=undefined;
    this.uldDetailModalVisibleAnimate = false;
    setTimeout(() => (this.uldDetailModalVisible = false), 300);
  }

  closebookingDetail(){
    this.bookingDetailModalVisibleAnimate = false;
    setTimeout(() => (this.bookingDetailModalVisible = false), 300);
  }

  closeAssginBooking() {
    this.assignBookingModalVisibleAnimate = false;
    setTimeout(() => (this.assignBookingModalVisible = false), 300);
  }

  openULDDetail(){
    this.uldDetailModalVisible = true;
    setTimeout(() => (this.uldDetailModalVisibleAnimate = true));
  }

  onULDClick(position:number){
    this.selectedPositionNumber= position;
    this.selectedCargoPosition = this.cargoBookingSummary?.cargoPositions?.filter(x=>x.position == position)[0];
    this.selectedCargoPosition!.destinationAirportCode = this.cargoBookingSummary?.destinationAirportCode;
    this.selectedCargoPosition!.position = position;
    this.openULDDetail();
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

}
