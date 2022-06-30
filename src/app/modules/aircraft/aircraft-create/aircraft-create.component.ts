import { AircraftSubType } from 'src/app/_models/view-models/aircrafts/aircraft-sub-type.model';
import { AircraftService } from './../../../_services/aircraft.service';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { AircraftConfigType, AircraftStatus } from 'src/app/core/enums/common-enums';

@Component({
  selector: 'app-aircraft-create',
  templateUrl: './aircraft-create.component.html',
  styleUrls: ['./aircraft-create.component.scss']
})
export class AircraftCreateComponent implements OnInit , OnChanges {

  keyword = 'value';
  subscription?:Subscription;
  aircraftTypes?:SelectList[]=[];
  configTypes:SelectList[]=[];
  statusTypes:SelectList[]=[];
  selectedSubTypes?:AircraftSubType[]=[];
  public aircraftForm!: FormGroup;
  editAircraftTypeIndex?:number;
  editConfigTypeIndex?:number;
  editStatusTypeIndex?:number;
  modalVisible = false;
  modalVisibleAnimate = false;
  @Output() viewLayout = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<any>();
  @Input() layoutAddedaircraftType: AircraftSubType = new AircraftSubType();


  constructor(private aircraftService:AircraftService) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(this.layoutAddedaircraftType != null){
      this.selectAircraftSubType(this.layoutAddedaircraftType);
    }
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getFileredAircraftTypes();
    this.loadCongigTypes();
    this.loadStatusTypes();
  } 

  loadCongigTypes(){
    this.configTypes.push({id:AircraftConfigType.P2C.toString(),value:CoreExtensions.GetAircraftConfigType(AircraftConfigType.P2C)},
      {id:AircraftConfigType.Freighter.toString(),value:CoreExtensions.GetAircraftConfigType(AircraftConfigType.Freighter)},
      {id:AircraftConfigType.Passenger.toString(),value:CoreExtensions.GetAircraftConfigType(AircraftConfigType.Passenger)});
  }

  loadStatusTypes(){
    this.statusTypes.push({id:AircraftStatus.Charter.toString(),value:CoreExtensions.GetAircraftStaus(AircraftStatus.Charter)},
      {id:AircraftStatus.Schedule.toString(),value:CoreExtensions.GetAircraftStaus(AircraftStatus.Schedule)},
      {id:AircraftStatus.Maintenance.toString(),value:CoreExtensions.GetAircraftStaus(AircraftStatus.Maintenance)});
  }

  initializeForm(){
    this.aircraftForm= new FormGroup({
      id: new FormControl(null),
      regNo: new FormControl(null, [Validators.required]),
      aircraftTypeId: new FormControl(null, [Validators.required]),
      aircraftSubTypeId : new FormControl(null, [Validators.required]),
      configurationType : new FormControl(null, [Validators.required]),
      status : new FormControl(null, [Validators.required]),
      isActive: new FormControl(false)
    });
  }

  getFileredAircraftTypes(){
    this.subscription = this.aircraftService.aircraftTypes$.subscribe(res => {
      if(res != null){
        res.forEach(obj=>{
          this.aircraftTypes?.push({id:obj.id,value:obj.name});
        });
      }
    });
  }

  selectAircraftSubType(model :AircraftSubType){
    if(this.selectedSubTypes != null &&
       this.selectedSubTypes.length >0){
        this.selectedSubTypes.forEach(obj=>{
          if(model.id == obj.id){
            if(model.isSelected){
              obj.isSelected= true;
              this.aircraftForm.get('aircraftSubTypeId')?.patchValue(model.id);
            }else{
              this.aircraftForm.get('aircraftSubTypeId')?.patchValue(null);
              obj.isSelected= false;
            }  
          }
        });
       }
  }

  selectedAircraftType(item: SelectList){
    this.aircraftForm.get('aircraftTypeId')?.patchValue(item.id);
    this.getSelectedAircraftSubTypes(item.id);
  }

  getSelectedAircraftSubTypes(aircraftMainTypeId:any){
    this.subscription = this.aircraftService.aircraftTypes$.subscribe(res => {
      if(res != null){
        res.forEach(obj=>{
          if(aircraftMainTypeId == obj.id){
            this.selectedSubTypes = obj.aircraftSubTypes;
          }
        });
      }
    });
  }

  onClearAircraftType(){
    this.aircraftForm.get('aircraftTypeId')?.patchValue(null);
    if(this.layoutAddedaircraftType != null){
      this.layoutAddedaircraftType.isSelected = false;
      this.selectAircraftSubType(this.layoutAddedaircraftType);
    }
    this.selectedSubTypes =[]
  }

  selectedConfigType(value: any){
    this.aircraftForm.get('configurationType')?.patchValue(Number(value.id));
  }

  onClearConfigType(){
    this.aircraftForm.get('configurationType')?.patchValue(null);
  }

  selectedStatusType(value: any){
    this.aircraftForm.get('status')?.patchValue(Number(value.id));
  }

  onClearStatusType(){
    this.aircraftForm.get('status')?.patchValue(null);
  }
  
  onViewLayout(model:AircraftSubType){
    this.viewLayout.emit(model);
  }

  onUnsilectLayout(model:AircraftSubType){
    model.isSelected = false;
    this.selectAircraftSubType(model);
  }

  saveAircraftDetails(){

  }

  closeModal() {
    this.aircraftForm.reset();
    this.closePopup.emit();
  }

}
