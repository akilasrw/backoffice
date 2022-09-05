import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rate-list',
  templateUrl: './rate-list.component.html',
  styleUrls: ['./rate-list.component.scss']
})
export class RateListComponent implements OnInit {

  addRatemodalVisible = false;
  addRateModalVisibleAnimate = false;

  rateDetailmodalVisible = false;
  rateDetailModalVisibleAnimate = false;

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

  openRateDetail() {
    this.rateDetailmodalVisible = true;
    setTimeout(() => (this.rateDetailModalVisibleAnimate = true));
  }


  closeRateDetail() {
    this.rateDetailModalVisibleAnimate = false;
    setTimeout(() => (this.rateDetailmodalVisible = false), 300);
  }

}
