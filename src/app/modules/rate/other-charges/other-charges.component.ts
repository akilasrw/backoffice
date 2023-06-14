import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-other-charges',
  templateUrl: './other-charges.component.html',
  styleUrls: ['./other-charges.component.scss']
})
export class OtherChargesComponent implements OnInit {

  addRatemodalVisible = false;
  addRateModalVisibleAnimate = false;
  rateDetailModalVisible = false;
  rateDetailModalVisibleAnimate = false;
  rateUpdateModalVisible = false;
  rateUpdateModalVisibleAnimate = false;

  constructor() { }

  ngOnInit(): void {
  }

  openAddRate() {
    this.addRatemodalVisible = true;
    setTimeout(() => (this.addRateModalVisibleAnimate = true));
  }

  closeAddRate() {
    this.addRateModalVisibleAnimate = false;
    setTimeout(() => (this.addRatemodalVisible = false), 300);
  }

  onUpdate() { // rateId: string
    //this.selectedRateId = rateId;
    this.rateUpdateModalVisible = true;
    setTimeout(() => (this.rateUpdateModalVisibleAnimate = true));
  }

  closeRateUpdate() {
    this.rateUpdateModalVisibleAnimate = false;
    setTimeout(() => (this.rateUpdateModalVisible = false), 300);
  }

}
