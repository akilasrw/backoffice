import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AircraftSubType } from 'src/app/_models/view-models/aircrafts/aircraft-sub-type.model';

@Component({
  selector: 'app-aircraft-select-layout',
  templateUrl: './aircraft-select-layout.component.html',
  styleUrls: ['./aircraft-select-layout.component.scss']
})
export class AircraftSelectLayoutComponent implements OnInit {

  @Input() aircraftSubType: AircraftSubType = new AircraftSubType();
  @Output() closePopup = new EventEmitter<any>();


  constructor() { }

  ngOnInit(): void {
  }

  closeModal() {
    this.closePopup.emit();
  }

  onAddLayout() {
    if (this.aircraftSubType != null) {
      this.aircraftSubType.isSelected = true;
      this.closeModal();
    }
  }

}
