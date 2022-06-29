import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { Aircaft } from './../../../_models/view-models/aircrafts/aircraft.model';
import { AircraftFilterQuery } from './../../../_models/queries/aircraft/aircraft-filter-query.model';
import { AircraftTypes } from './../../../core/enums/common-enums';
import { AircraftService } from './../../../_services/aircraft.service';
import { Component, OnInit } from '@angular/core';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { Subscription } from 'rxjs';
import { AircraftType } from 'src/app/_models/view-models/aircrafts/aircraft-type.model';

@Component({
  selector: 'app-aircraft-list',
  templateUrl: './aircraft-list.component.html',
  styleUrls: ['./aircraft-list.component.scss']
})
export class AircraftListComponent implements OnInit {

  regNumber?:string;
  selectedAircraftType?: number;
  totalCount: number = 0;
  modalVisible = false;
  modalVisibleAnimate = false;
  aircraftTypes?:SelectList[]=[];
  subscription?:Subscription;
  aircrafts:Aircaft[]=[];
  aircraftFilterQuery:  AircraftFilterQuery = new AircraftFilterQuery();
  keyword = 'value';


  constructor(private aircraftServce:AircraftService) { }

  ngOnInit(): void {
    this.getAircraftTypes();
    this.getAircraftList()
  }

  getAircraftList() {
    this.aircraftFilterQuery.regNo = this.regNumber;
    this.aircraftFilterQuery.aircraftType = this.selectedAircraftType;
    this.aircraftFilterQuery.isActive = true;
    this.aircraftServce.getFilteredList(this.aircraftFilterQuery).subscribe(
      {
        next: (res) => {
          this.aircrafts = res.data
          this.totalCount = res.count
        },
        error: (error) => {
          this.totalCount = 0;
          this.aircrafts = []
        }
      }
    )
  }

  getAircraftTypes() {
    this.aircraftServce.getAircraftTypes().subscribe({
      next:(res)=>{
        this.getFileredAircraftTypes();
      },
      error:(err)=>{
       
      }
    });
  }

  getFileredAircraftTypes(){
    this.subscription = this.aircraftServce.aircraftTypes$.subscribe(res => {
      if(res != null){
        res.forEach(obj=>{
          this.aircraftTypes?.push({id:obj.type?.toString(),value:obj.name});
        });
      }
    });
  }

  selectedAircraft(value: any){
    this.selectedAircraftType = Number(value.id);
  }

  onClearAircraft(){
    this.selectedAircraftType = undefined;
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

  GetAircraftType(type:number){
    CoreExtensions.GetAircraftType(type);
  }


}
