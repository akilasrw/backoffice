import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-airport-list',
  templateUrl: './airport-list.component.html',
  styleUrls: ['./airport-list.component.scss']
})
export class AirportListComponent implements OnInit {

  modalVisible = false;
  modalVisibleAnimate = false;

  constructor() { }

  ngOnInit(): void {
  }

  addAirport(){
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  closeAddAirport() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }
}
