import { Component, OnInit } from '@angular/core';
import { SelectList } from 'src/app/shared/models/select-list.model';

@Component({
  selector: 'app-aircraft-list',
  templateUrl: './aircraft-list.component.html',
  styleUrls: ['./aircraft-list.component.scss']
})
export class AircraftListComponent implements OnInit {

  regNumber?:string;
  totalCount: number = 0;
  aircraftTypes : SelectList[] = [];
  modalVisible = false;
  modalVisibleAnimate = false;
  keyword = 'value';


  constructor() { }

  ngOnInit(): void {
  }

  getAircraftList(){

  }

  selectedAircraft(value: any){

  }

  onClearAircraft(){

  }

  addAircraft(){
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  onChangeFilterFrm(event: any){

  }

  closeAddAircraft(){
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  onAircraftAdd(){
    
  }


}
