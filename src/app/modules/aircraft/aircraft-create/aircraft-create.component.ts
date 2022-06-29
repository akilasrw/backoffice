import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aircraft-create',
  templateUrl: './aircraft-create.component.html',
  styleUrls: ['./aircraft-create.component.scss']
})
export class AircraftCreateComponent implements OnInit {

  modalVisible = false;
  modalVisibleAnimate = false;

  constructor() { }

  ngOnInit(): void {
  }

  addLayout(){
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  closeAddLayout(){
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  onLayoutAdd(){

  }
}
