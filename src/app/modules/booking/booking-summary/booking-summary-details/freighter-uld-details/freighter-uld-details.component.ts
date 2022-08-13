import { Component, Input, OnInit } from '@angular/core';
import { CargoPositionDetail } from 'src/app/_models/view-models/booking-summary/cargo-position-detail.model';

@Component({
  selector: 'app-freighter-uld-details',
  templateUrl: './freighter-uld-details.component.html',
  styleUrls: ['./freighter-uld-details.component.scss']
})
export class FreighterUldDetailsComponent implements OnInit {

  @Input() positionDetail: CargoPositionDetail = new CargoPositionDetail();

  constructor() { }

  ngOnInit(): void {
    
  }

}
