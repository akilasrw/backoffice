import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sector-list',
  templateUrl: './sector-list.component.html',
  styleUrls: ['./sector-list.component.scss']
})
export class SectorListComponent implements OnInit {

  modalVisible = false;
  modalVisibleAnimate = false;

  constructor() { }

  ngOnInit(): void {
  }

  closeAddSector() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  addSector() {
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

}
