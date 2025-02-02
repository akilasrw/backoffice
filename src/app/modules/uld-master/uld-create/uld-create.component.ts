import { UldCreateRM } from './../../../_models/request-models/uld-master/uld-create-rm';
import { ULDLocateStatus, ULDType, UnitType, ULDOwnershipType } from './../../../core/enums/common-enums';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Unit } from 'src/app/_models/view-models/unit/unit.model';
import { UnitService } from 'src/app/_services/unit.service';
import { ULDService } from 'src/app/_services/uld.service';
import { ToastrService } from 'ngx-toastr';
import { ULD } from 'src/app/_models/view-models/uld-master/ulsd.model';
import { UldUpdateRM } from 'src/app/_models/request-models/uld-master/uld-update-rm';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { AirportService } from 'src/app/_services/airport.service';

@Component({
  selector: 'app-uld-create',
  templateUrl: './uld-create.component.html',
  styleUrls: ['./uld-create.component.scss']
})
export class UldCreateComponent implements OnInit {

  isLoading: boolean = false;
  public uldForm!: FormGroup;
  selectedULDType: ULDType = ULDType.Pallet;
  selectedULDStatus: ULDLocateStatus = ULDLocateStatus.OnGround;
  selectedULDOwnershipType: ULDOwnershipType = ULDOwnershipType.OwnByAirline;
  airports: SelectList[] = []; 
  volumeUnits: Unit[] = [];
  weightUnits: Unit[] = [];
  @Output() closePopup = new EventEmitter<any>();
  @Output() submitSuccess = new EventEmitter<any>();
  @Input() uld: ULD = new ULD();
  isEditULD: boolean = false;

  constructor(private unitService: UnitService,
    private fb: FormBuilder,
    private uldService: ULDService,
    private airportService: AirportService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initializForm();
    this.getUnits();
    this.loadAirports();
    if (this.uld != null) {
      this.isEditULD = true;
      this.editForm(this.uld);
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }
  }
  
   airportKeyword: string = '';
   selectedAirportId: string | null = null;
   selectedAirportIndex: number | null = null; 


   convertToMeters(value: number, fromUnitId: string): number {
  switch(fromUnitId) {
    case '9f0928df-5d33-4e5d-affc-f7e2e2b72680': // cm
      return Number((value / 100).toFixed(2));
    case '11c39205-4153-49f1-ab50-bba8913c5bb9': // inch
      return Number((value * 0.0254).toFixed(2));
    case 'fe919429-80ea-4a0e-a218-5db6e16f690c': // m
      return Number(value.toFixed(2));
    default:
      return Number(value.toFixed(2));
  }
}
  

  initializForm() {
    this.uldForm = this.fb.group({
      id: [null],
      uLDType: [this.selectedULDType, [Validators.required]],
      serialNumber: [null, [Validators.required,Validators.pattern(/^[A-Z]{3} \d{4,5} [A-Z0-9]{2}$/)]],
      uLDOwnershipType: [this.selectedULDOwnershipType, [Validators.required]],
      ownerAirlineCode: [null, [Validators.pattern("^[a-zA-Z]+$"), Validators.maxLength(2)]],
      uLDLocateStatus: [this.selectedULDStatus, [Validators.required]],
      lendAirlineCode: [null, [Validators.pattern("^[a-zA-Z]+$"), Validators.maxLength(2)]],
      airportID: [null, Validators.required],
      uldMetaDataId: [null],
      uLDMetaData: this.fb.group({
        id: [null],
        width: [0, [Validators.required, Validators.min(1),Validators.max(400)]],
        length: [0, [Validators.required, Validators.min(1),Validators.max(600)]],
        height: [0, [Validators.required, Validators.min(1)]],
        weight: [0, [Validators.required, Validators.min(1)]],
        maxWeight: [0, [Validators.required, Validators.min(1),Validators.max(15000)]],
        maxVolume: [0, [Validators.required, Validators.min(1)]],
        volumeUnitId: ['9f0928df-5d33-4e5d-affc-f7e2e2b72680', [Validators.required]],
        weightUnitId: ['bc1e3d49-5c26-4de5-9cd4-576bbf6e9d0c', [Validators.required]],
      })
    });
  }

  loadAirports() {
    this.airportService.getSelectList()
      .subscribe(res => {
        console.log(res);
        if (res.length > 0) {
          this.airports = res; // Assign the response to the airports property
        }
      });
  }

  editForm(uld: ULD) {
    if(this.uldForm) {
      this.uldForm.reset();
      this.uldForm.get('id')?.patchValue(uld.id);
      this.uldForm.get('uLDType')?.patchValue(uld.uldType);
      this.uldForm.get('serialNumber')?.patchValue(uld.serialNumber);
      this.uldForm.get('uLDOwnershipType')?.patchValue(uld.uldOwnershipType);
      this.uldForm.get('ownerAirlineCode')?.patchValue(uld.ownerAirlineCode);
      this.uldForm.get('uLDLocateStatus')?.patchValue(uld.uldLocateStatus);
      this.uldForm.get('lendAirlineCode')?.patchValue(uld.lendAirlineCode);
      this.uldForm.get('uldMetaDataId')?.patchValue(uld.uldMetaDataId);
      this.uldForm.get('uLDMetaData')?.get('id')?.patchValue(uld.uldMetaDataId);
      this.uldForm.get('uLDMetaData')?.get('width')?.patchValue(uld.width);
      this.uldForm.get('uLDMetaData')?.get('length')?.patchValue(uld.length);
      this.uldForm.get('uLDMetaData')?.get('height')?.patchValue(uld.height);
      this.uldForm.get('uLDMetaData')?.get('weight')?.patchValue(uld.weight);
      this.uldForm.get('airportID')?.patchValue(uld.airportID);
      this.uldForm.get('uLDMetaData')?.get('maxWeight')?.patchValue(uld.maxWeight);
      this.selectedAirportId = uld.airportID || null; 
      this.uldForm.get('uLDMetaData')?.get('maxVolume')?.patchValue(uld.maxVolume);
      this.uldForm.get('uLDMetaData')?.get('volumeUnitId')?.patchValue('9f0928df-5d33-4e5d-affc-f7e2e2b72680');
      this.uldForm.get('uLDMetaData')?.get('weightUnitId')?.patchValue('bc1e3d49-5c26-4de5-9cd4-576bbf6e9d0c');
      this.selectedULDType = uld.uldType? uld.uldType: ULDType.Pallet;;
      this.selectedULDStatus = uld.uldLocateStatus? uld.uldLocateStatus: ULDLocateStatus.OnGround;
      this.selectedULDOwnershipType = uld.uldOwnershipType? uld.uldOwnershipType: ULDOwnershipType.OwnByAirline;
      this.disableInputForEdit();
    }
  }

  selectedAirport(airport: SelectList) {
    console.log('Selected airport:', airport);
    this.selectedAirportId = airport.id || null;
    this.uldForm.get('airportID')?.patchValue(airport.id);
  }

  onChangeAirportSearch(keyword: string) {
    this.airportKeyword = keyword;
  }

  onClearAirport() {
    this.airportKeyword = '';
    this.selectedAirportId = null;
    this.uldForm.get('airportID')?.patchValue(null);
  }

  disableInputForEdit() {
    this.uldForm.get('uLDOwnershipType')?.disable();
    this.uldForm.get('uLDType')?.disable();
    this.uldForm.get('uLDMetaData')?.get('volumeUnitId')?.disable();
    this.uldForm.get('uLDMetaData')?.get('weightUnitId')?.disable();
  }

  getUnits() {
    this.unitService.getList()
      .subscribe(res => {
        this.weightUnits = res.filter(x => x.unitType == UnitType.Mass);
        this.volumeUnits = res.filter(x => x.unitType == UnitType.Length);
      });
  }

  setTheDementions() {

    this.uldForm.get('uLDMetaData')?.get('width')?.patchValue(this.convertToMeters(this.uldForm.get('uLDMetaData')?.get('width')?.value, this.uldForm.get('uLDMetaData')?.get('volumeUnitId')?.value));
    this.uldForm.get('uLDMetaData')?.get('length')?.patchValue(this.convertToMeters(this.uldForm.get('uLDMetaData')?.get('length')?.value, this.uldForm.get('uLDMetaData')?.get('volumeUnitId')?.value));
    this.uldForm.get('uLDMetaData')?.get('height')?.patchValue(this.convertToMeters(this.uldForm.get('uLDMetaData')?.get('height')?.value, this.uldForm.get('uLDMetaData')?.get('volumeUnitId')?.value));
  }

  get ULDType(): typeof ULDType {
    return ULDType;
  }

  get ULDLocateStatus(): typeof ULDLocateStatus {
    return ULDLocateStatus;
  }

  get ULDOwnershipType(): typeof ULDOwnershipType {
    return ULDOwnershipType;
  }

  onChangeULDType() {
    this.selectedULDType = this.uldForm.get('uLDType')?.value;
  }

  onChangeULDStatus() {
    this.selectedULDStatus = this.uldForm.get('uLDLocateStatus')?.value;
  }

  onChangeULDOwnershipType(event:  any) {
    this.selectedULDOwnershipType = this.uldForm.get('uLDOwnershipType')?.value;
  }

  closeModal() {
    this.uldForm.reset();
    this.closePopup.emit();
  }

 

  saveULDDetails() {
    console.log("method calling")
    if (this.uldForm.valid) {
      console.log("form valid")
      if (this.isEditULD) {

        console.log("edit uld")

        var editUld: UldUpdateRM = this.uldForm.value;
        console.log(this.uldForm.value);
        editUld.uLDType = this.selectedULDType;
        editUld.uLDOwnershipType = this.selectedULDOwnershipType;
        editUld.lastUsed = this.uld.lastUsed;
        editUld.lastFlight = this.uld.lastFlight

        var metadata = editUld.uLDMetaData
        if(metadata != undefined) {
          metadata.volumeUnitId ='9f0928df-5d33-4e5d-affc-f7e2e2b72680';
          metadata.weightUnitId ='bc1e3d49-5c26-4de5-9cd4-576bbf6e9d0c';
        }


        console.log(editUld)

        this.uldService.update(editUld).subscribe({
          next: (res) => {
            this.toastr.success('Updated successfully.');
            this.submitSuccess.emit();
            this.closeModal();
            this.isLoading = false;
            this.isEditULD = false;
          },
          error: (err) => {
            this.isLoading = false;
          }
        })
      } else {
        console.log("add uld")
        if (this.uldForm.get('uLDOwnershipType')?.value ===  ULDOwnershipType.Other && this.uldForm.get('ownerAirlineCode')?.value == null) {
          this.toastr.error('Please enter ULD own airline code.');
          return;
        }

        if (this.uldForm.get('uLDLocateStatus')?.value ===  ULDLocateStatus.Lend && this.uldForm.get('lendAirlineCode')?.value == null) {
          this.toastr.error('Please enter ULD lend airline code.');
          return;
        }

        this.isLoading = true;
        var uld: UldCreateRM = this.uldForm.value;
        console.log(uld, 'uld')
        if (uld.uLDMetaData) {
          console.log(uld.uLDMetaData, 'm1')
          uld.uLDMetaData.volumeUnitId = '9f0928df-5d33-4e5d-affc-f7e2e2b72680';
          console.log(uld.uLDMetaData, 'm2')
        }

        this.uldService.create(uld).subscribe({
          next: (res) => {
            this.toastr.success('ULD added successfully.');
            this.submitSuccess.emit();
            this.closeModal();
            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
          }
        });
        this.uldForm.markAsUntouched();
      }

    } else {
      this.uldForm.markAllAsTouched();
    }
  }

}
