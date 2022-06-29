import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-aircraft-create',
  templateUrl: './aircraft-create.component.html',
  styleUrls: ['./aircraft-create.component.scss']
})
export class AircraftCreateComponent implements OnInit {

  modalVisible = false;
  modalVisibleAnimate = false;
  @Output() viewLayout = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {

  }

  
  onViewLayout(){
    this.viewLayout.emit();
  }
 

}
