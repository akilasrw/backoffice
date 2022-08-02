import { Component, OnInit } from '@angular/core';
import { CargoBookingSummaryDetail } from 'src/app/_models/view-models/booking-summary/cargo-booking-summary-detail.model';

@Component({
  selector: 'app-freighter-booking-summary-details',
  templateUrl: './freighter-booking-summary-details.component.html',
  styleUrls: ['./freighter-booking-summary-details.component.scss']
})
export class FreighterBookingSummaryDetailsComponent implements OnInit {

  cargoBookingSummary?: CargoBookingSummaryDetail;
  modalVisible = false;
  modalVisibleAnimate = false;

  constructor() { }

  ngOnInit(): void {

  }


  backToList(){

  }

  viewLIR(){
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  closeLIR(){
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

}
