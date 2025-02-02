import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CargoPositionDetail } from 'src/app/_models/view-models/booking-summary/cargo-position-detail.model';

@Component({
  selector: 'app-al-b737400-type-one',
  templateUrl: './al-b737400-type-one.component.html',
  styleUrls: ['./al-b737400-type-one.component.scss']
})
export class AlB737400TypeOneComponent implements OnInit {

  @Output() ULDClick = new EventEmitter<any>();
  @Input() cargoPositions?: CargoPositionDetail[];
  selectedCargoPosition: any;
  selectedPosition: number = 0;
  @Input() isCreated: boolean = true;
  
  constructor() { }

  ngOnInit(): void {

  }

  over(pos: number) {
    this.selectedPosition = pos;
    this.selectedCargoPosition = this.cargoPositions?.filter(x=>x.position == pos)[0];
  }

  leave(){
    this.selectedPosition = 0;
  }

  onULDClick(uldPosition:number){
    this.ULDClick.emit(uldPosition);
  }
}
