import { AircraftCreateRM } from './../../../_models/request-models/aircraft/aircraft-create-rm';
import { AircraftSubType } from 'src/app/_models/view-models/aircrafts/aircraft-sub-type.model';
import { AircraftService } from './../../../_services/aircraft.service';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { AircraftConfigType, AircraftStatus } from 'src/app/core/enums/common-enums';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-aircraft-create',
  templateUrl: './aircraft-create.component.html',
  styleUrls: ['./aircraft-create.component.scss']
})
export class AircraftCreateComponent implements OnInit {

  keyword = 'value';
  subscription?:Subscription;
  aircraftTypes?:SelectList[]=[];
  configTypes:SelectList[]=[];
  statusTypes:SelectList[]=[];
  aircraftSubTypes?:AircraftSubType[]=[];
  selectedAircraftSubType?:AircraftSubType;
  public aircraftForm!: FormGroup;
  editAircraftTypeIndex?:number;
  editConfigTypeIndex?:number;
  editStatusTypeIndex?:number;
  modalVisible = false;
  modalVisibleAnimate = false;
  @Output() viewLayout = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<any>();
  @Output() submitSuccess = new EventEmitter<any>();


  constructor(private aircraftService:AircraftService,private toastr:ToastrService) { }
  
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

  selectedAircraftType(item: SelectList){
    this.aircraftForm.get('aircraftTypeId')?.patchValue(item.id);
    this.getSelectedAircraftSubTypes(item.id);
  }

  getSelectedAircraftSubTypes(aircraftMainTypeId:any){
    this.subscription = this.aircraftService.aircraftTypes$.subscribe(res => {
      if(res != null){
        res.forEach(obj=>{
          if(aircraftMainTypeId == obj.id){
            this.aircraftSubTypes = obj.aircraftSubTypes;
          }
        });
      }
    });
  }

  onClearAircraftType(){
    this.aircraftForm.get('aircraftTypeId')?.patchValue(null);
    this.aircraftForm.get('aircraftSubTypeId')?.patchValue(null);
    this.selectedAircraftSubType = undefined;
    this.clearAircraftSubTypeSelection();
    this.aircraftSubTypes =[]
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
    this.selectedAircraftSubType = model;
    this.viewLayout.emit(model);
  }

  onUnsilectLayout(model:AircraftSubType){
    model.isSelected = false;
    if(this.selectedAircraftSubType != undefined){
      this.setAircraftSubTypeId(this.selectedAircraftSubType);
    }
    this.selectedAircraftSubType = undefined;
  }

  setAircraftSubTypeId(model :AircraftSubType){
    if(this.aircraftSubTypes != null &&
       this.aircraftSubTypes.length >0){
        this.aircraftSubTypes.forEach(obj=>{
          if(model.id == obj.id){
            if(obj.isSelected){
              this.aircraftForm.get('aircraftSubTypeId')?.patchValue(obj.id);
            }else{
              this.aircraftForm.get('aircraftSubTypeId')?.patchValue(null);
            }  
          }
        });
       }
  }

  clearAircraftSubTypeSelection(){
    if(this.aircraftSubTypes != null &&
       this.aircraftSubTypes.length >0){
        this.aircraftSubTypes.forEach(obj=>{
          if(obj.isSelected){
            obj.isSelected = false;
          }
        });
       }
  }

  saveAircraftDetails(){
    if(this.selectedAircraftSubType != undefined){
      this.setAircraftSubTypeId(this.selectedAircraftSubType);
    }

    if (this.aircraftForm.get('aircraftTypeId')?.value === null || this.aircraftForm.get('aircraftTypeId')?.value === "") {
      this.toastr.error('Please select aircraft type.');
    }
    if (this.aircraftForm.get('aircraftSubTypeId')?.value === null || this.aircraftForm.get('aircraftSubTypeId')?.value === "") {
      this.toastr.error('Please select aircraft sub type.');
    }
    if (this.aircraftForm.get('configurationType')?.value === null || this.aircraftForm.get('configurationType')?.value === "") {
      this.toastr.error('Please select aircraft configuration type.');
    }
    if (this.aircraftForm.get('status')?.value === null || this.aircraftForm.get('status')?.value === "") {
      this.toastr.error('Please select aircraft status.');
    }

    if (this.aircraftForm.valid) {

      var aircraft: AircraftCreateRM = this.aircraftForm.value;
        this.aircraftService.create(aircraft).subscribe({
          next: (res) => {
            this.toastr.success('Successfully create aircraft.');
            this.submitSuccess.emit();
            this.closeModal();
          },
          error: (err) => {
          }
        })

    } else {
      this.aircraftForm.markAllAsTouched();
    }
  }

  closeModal() {
    this.aircraftForm.reset();
    this.closePopup.emit();
  }

}
