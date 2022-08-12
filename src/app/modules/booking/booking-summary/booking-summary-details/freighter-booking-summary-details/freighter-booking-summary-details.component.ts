import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AircraftSubTypes } from 'src/app/core/enums/common-enums';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { BookingSummaryDetailQuery } from 'src/app/_models/queries/booking-summary/booking-summary-detail-query.model';
import { CargoBookingSummaryDetail } from 'src/app/_models/view-models/booking-summary/cargo-booking-summary-detail.model';
import { BookingSummaryService } from 'src/app/_services/booking-summary.service';

@Component({
  selector: 'app-freighter-booking-summary-details',
  templateUrl: './freighter-booking-summary-details.component.html',
  styleUrls: ['./freighter-booking-summary-details.component.scss']
})
export class FreighterBookingSummaryDetailsComponent implements OnInit {

  cargoBookingSummary?: CargoBookingSummaryDetail;
  modalVisible = false;
  modalVisibleAnimate = false;
  uldDetailModalVisible = false;
  uldDetailModalVisibleAnimate = false;
  flightScheduleId?: string;

  constructor(private activatedRoute: ActivatedRoute, private bookingSummaryService: BookingSummaryService) { }

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
    bookingSummaryQuery.isIncludeAircraft = true;
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
    this.uldDetailModalVisibleAnimate = false;
    setTimeout(() => (this.uldDetailModalVisible = false), 300);
  }

  openULDDetail(){
    this.uldDetailModalVisible = true;
    setTimeout(() => (this.uldDetailModalVisibleAnimate = true));
  }

  onULDClick(position:number){
    this.openULDDetail();
  }
  
  convertcm3Tom3(volume: number): number {
    return volume / 1000000;
  }

}
