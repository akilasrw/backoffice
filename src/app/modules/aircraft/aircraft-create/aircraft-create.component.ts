import { AircraftUpdateRM } from './../../../_models/request-models/aircraft/aircraft-update-rm';
import { Aircraft } from './../../../_models/view-models/aircrafts/aircraft.model';
import { AircraftCreateRM } from './../../../_models/request-models/aircraft/aircraft-create-rm';
import { AircraftSubType } from 'src/app/_models/view-models/aircrafts/aircraft-sub-type.model';
import { AircraftService } from './../../../_services/aircraft.service';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
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
export class AircraftCreateComponent implements OnInit, OnDestroy{

  keyword = 'value';
  subscription?: Subscription;
  aircraftTypes?: SelectList[] = [];
  configTypes: SelectList[] = [];
  statusTypes: SelectList[] = [];
  aircraftSubTypes?: AircraftSubType[] = [];
  selectedConfigurationType?: AircraftConfigType = AircraftConfigType.None;
  selectedAircraftSubType?: AircraftSubType;
  aircraftForm!: FormGroup;
  editAircraftTypeIndex?: number;
  editConfigTypeIndex?: number;
  editStatusTypeIndex?: number;
  modalVisible: boolean = false;
  modalVisibleAnimate: boolean = false;
  isEditAircraft: boolean = false;
  isLoading: boolean = false;
  isMaintenance: boolean=false;
  @Output() viewLayout = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<any>();
  @Output() submitSuccess = new EventEmitter<any>();
  @Input() editAircraft: Aircraft = new Aircraft();


  constructor(private aircraftService: AircraftService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();
    if (this.editAircraft != null) {
      this.isEditAircraft = true;
      this.editAircraftForm(this.editAircraft);
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }
    this.loadConfigTypes();
    this.loadStatusTypes();
  }

  initializeForm() {
    this.aircraftForm = new FormGroup({
      id: new FormControl(null),
      regNo: new FormControl(null, [Validators.required, Validators.pattern("^[a-zA-Z0-9_]+$")],),
      aircraftTypeId: new FormControl(null, [Validators.required]),
      aircraftSubTypeId: new FormControl(null, [Validators.required]),
      configurationType: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
      isActive: new FormControl(true),
      aCheck: new FormControl(null),
      bCheck: new FormControl(null),
      cCheck: new FormControl(null)
    });
  }

  editAircraftForm(aircraft: Aircraft) {
    this.getFileredAircraftTypes(aircraft.configurationType!);
    this.aircraftForm.get('id')?.patchValue(aircraft.id);
    this.aircraftForm.get('regNo')?.patchValue(aircraft.regNo);
    var typeId = this.getAircraftTypeIdByType(aircraft.aircraftType);
    this.aircraftForm.get('aircraftTypeId')?.patchValue(typeId);
    if (this.isEditAircraft) {
      this.editAircraftTypeIndex = this.aircraftTypes?.findIndex(x => x.id == typeId);
    }
    this.getSelectedAircraftSubTypes(typeId);
    this.aircraftForm.get('aircraftSubTypeId')?.patchValue(this.getAircraftSubTypeIdBySubType(aircraft.aircraftSubType));
    this.aircraftForm.get('configurationType')?.patchValue(aircraft.configurationType);
    this.selectedConfigurationType = aircraft.configurationType;
    this.aircraftForm.get('status')?.patchValue(aircraft.status);
    this.aircraftForm.get('isActive')?.patchValue(aircraft.isActive);
  }

  getAircraftTypeIdByType(aircraftType?: number): string {
    var typeId: string | undefined = "";
    this.subscription = this.aircraftService.aircraftTypes$.subscribe(res => {
      if (res != null) {
        res.forEach(obj => {
          if (obj.type == aircraftType) {
            typeId = obj.id
          }
        });
      }
    });
    return typeId;
  }

  getAircraftSubTypeIdBySubType(aircraftSubType?: number): string {
    var typeId: string | undefined = "";
    if (this.aircraftSubTypes != undefined) {
      this.aircraftSubTypes.forEach(element => {
        if (element.type == aircraftSubType) {
          typeId = element.id
          element.isSelected = true;
        }
      });
    }
    return typeId;
  }

  getFileredAircraftTypes(configType: AircraftConfigType) {
    this.subscription = this.aircraftService.aircraftTypes$.subscribe(res => {
      if (res != null) {
        this.aircraftTypes = []
        res.forEach(obj => {
          if (obj.configType == configType) {
            this.aircraftTypes?.push({ id: obj.id, value: obj.name });
          }
        });
      }
    });
  }

  loadConfigTypes() {
    this.configTypes.push({ id: AircraftConfigType.P2C.toString(), value: CoreExtensions.GetAircraftConfigType(AircraftConfigType.P2C) },
      { id: AircraftConfigType.Freighter.toString(), value: CoreExtensions.GetAircraftConfigType(AircraftConfigType.Freighter) });
    if (this.isEditAircraft) {
      this.editConfigTypeIndex = this.configTypes.findIndex(x => x.id == this.editAircraft.configurationType?.toString());
    console.log(this.configTypes);
    console.log(this.editAircraft.configurationType?.toString());
    console.log(this.editConfigTypeIndex);

    }
  }

  loadStatusTypes() {
    this.statusTypes.push({ id: AircraftStatus.Charter.toString(), value: CoreExtensions.GetAircraftStaus(AircraftStatus.Charter) },
      { id: AircraftStatus.Schedule.toString(), value: CoreExtensions.GetAircraftStaus(AircraftStatus.Schedule) },
      { id: AircraftStatus.Maintenance.toString(), value: CoreExtensions.GetAircraftStaus(AircraftStatus.Maintenance) });
    if (this.isEditAircraft) {
      this.editStatusTypeIndex = this.statusTypes.findIndex(x => x.id == this.editAircraft.status?.toString());
    }
  }

  selectedAircraftType(item: SelectList) {
    this.aircraftForm.get('aircraftTypeId')?.patchValue(item.id);
    this.getSelectedAircraftSubTypes(item.id);
  }

  getSelectedAircraftSubTypes(aircraftMainTypeId: any) {
    this.subscription = this.aircraftService.aircraftTypes$.subscribe(res => {
      if (res != null) {
        res.forEach(obj => {
          if (aircraftMainTypeId == obj.id) {
            this.aircraftSubTypes = obj.aircraftSubTypes;
          }
        });
      }
    });
  }

  onClearAircraftType() {
    this.editAircraftTypeIndex = undefined;
    this.aircraftForm.get('aircraftTypeId')?.patchValue(null);
    this.aircraftForm.get('aircraftSubTypeId')?.patchValue(null);
    this.selectedAircraftSubType = undefined;
    this.clearAircraftSubTypeSelection();
    this.aircraftSubTypes = []
  }

  selectedConfigType(value: any) {
    this.aircraftForm.get('configurationType')?.patchValue(Number(value.id));
    this.selectedConfigurationType = Number(value.id);
    this.onClearAircraftType(); 
    this.getFileredAircraftTypes(this.selectedConfigurationType);
  }

  onClearConfigType() {
    this.editConfigTypeIndex=undefined;
    this.aircraftForm.get('configurationType')?.patchValue(null);
    this.selectedConfigurationType = AircraftConfigType.None;
    this.aircraftTypes = []
    this.onClearAircraftType();
  }

  selectedStatusType(value: any) {
    this.aircraftForm.get('status')?.patchValue(Number(value.id));
  }

  onClearStatusType() {
    this.editStatusTypeIndex = undefined;
    this.aircraftForm.get('status')?.patchValue(null);
  }

  onViewLayout(model: AircraftSubType) {
    this.selectedAircraftSubType = model;
    this.viewLayout.emit(model);
  }

  onUnsilectLayout(model: AircraftSubType) {
    model.isSelected = false;
    if (this.selectedAircraftSubType != undefined) {
      this.setAircraftSubTypeId(this.selectedAircraftSubType);
    }
    this.selectedAircraftSubType = undefined;
  }

  setAircraftSubTypeId(model: AircraftSubType) {
    if (this.aircraftSubTypes != null &&
      this.aircraftSubTypes.length > 0) {
      this.aircraftSubTypes.forEach(obj => {
        if (model.id == obj.id) {
          if (obj.isSelected) {
            this.aircraftForm.get('aircraftSubTypeId')?.patchValue(obj.id);
          } else {
            this.aircraftForm.get('aircraftSubTypeId')?.patchValue(null);
          }
        }
      });
    }
  }

  clearAircraftSubTypeSelection() {
    if (this.aircraftSubTypes != null &&
      this.aircraftSubTypes.length > 0) {
      this.aircraftSubTypes.forEach(obj => {
        if (obj.isSelected) {
          obj.isSelected = false;
        }
      });
    }
  }

  saveAircraftDetails() {
    if (this.selectedAircraftSubType != undefined) {
      this.setAircraftSubTypeId(this.selectedAircraftSubType);
    }

    if (this.aircraftForm.get('configurationType')?.value === null || this.aircraftForm.get('configurationType')?.value === "") {
      this.toastr.error('Please select aircraft configuration type.');
      return;
    }
    if (this.aircraftForm.get('aircraftTypeId')?.value === null || this.aircraftForm.get('aircraftTypeId')?.value === "") {
      this.toastr.error('Please select aircraft type.');
      return;
    }
    if (this.aircraftForm.get('aircraftSubTypeId')?.value === null || this.aircraftForm.get('aircraftSubTypeId')?.value === "") {
      this.toastr.error('Please select aircraft sub type.');
      return;
    }
    if (this.aircraftForm.get('status')?.value === null || this.aircraftForm.get('status')?.value === "") {
      this.toastr.error('Please select aircraft status.');
      return;
    }
    if(this.isMaintenance){
      if(this.aircraftForm.get('aCheck')?.value === null || this.aircraftForm.get('aCheck')?.value === ""){
        this.toastr.error('Please set A check.');
        return;
      }
      if(this.aircraftForm.get('bCheck')?.value === null || this.aircraftForm.get('bCheck')?.value === ""){
        this.toastr.error('Please set B check.');
        return;
      }
      if(this.aircraftForm.get('cCheck')?.value === null || this.aircraftForm.get('cCheck')?.value === ""){
        this.toastr.error('Please set C check.');
        return;
      }
    }

    if (this.aircraftForm.valid) {
      this.isLoading=true;
      if (this.isEditAircraft) {
        var editAircraft: AircraftUpdateRM = this.aircraftForm.value;
        this.aircraftService.update(editAircraft).subscribe({
          next: (res) => {
            this.toastr.success('Successfully update aircraft.');
            this.submitSuccess.emit();
            this.closeModal();
            this.isLoading=false;
          },
          error: (err) => {
            this.isLoading=false;
          }
        })
      } else {
        var aircraft: AircraftCreateRM = this.aircraftForm.value;
        this.aircraftService.create(aircraft).subscribe({
          next: (res) => {
            this.toastr.success('Successfully create aircraft.');
            this.submitSuccess.emit();
            this.closeModal();
            this.isLoading=false;
          },
          error: (err) => {
            this.editConfigTypeIndex = this.configTypes.findIndex(x => x.id == aircraft.configurationType?.toString());
            this.editAircraftTypeIndex = this.aircraftTypes?.findIndex(x => x.id == aircraft.aircraftTypeId);
            this.editStatusTypeIndex = this.statusTypes.findIndex(x => x.id == aircraft.status?.toString());
            this.isLoading=false;
          }
        });
      }
    } else {
      this.aircraftForm.markAllAsTouched();
    }
  }

  closeModal() {
    this.closePopup.emit();
  }

  get aircraftConfigType(): typeof AircraftConfigType {
    return AircraftConfigType;
  }

  ngOnDestroy(): void {
    this.aircraftForm.reset();
    this.onClearAircraftType();
  }
}
