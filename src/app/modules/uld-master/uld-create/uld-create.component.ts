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
  volumeUnits: Unit[] = [];
  weightUnits: Unit[] = [];
  @Output() closePopup = new EventEmitter<any>();
  @Output() submitSuccess = new EventEmitter<any>();
  @Input() uld: ULD = new ULD();
  isEditULD: boolean = false;

  constructor(private unitService: UnitService,
    private fb: FormBuilder,
    private uldService: ULDService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initializForm();
    this.getUnits();
    if (this.uld != null) {
      this.isEditULD = true;
      this.editForm(this.uld);
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
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
      this.uldForm.get('uLDMetaData')?.get('maxWeight')?.patchValue(uld.maxWeight);
      this.uldForm.get('uLDMetaData')?.get('maxVolume')?.patchValue(uld.maxVolume);
      this.uldForm.get('uLDMetaData')?.get('volumeUnitId')?.patchValue('9f0928df-5d33-4e5d-affc-f7e2e2b72680');
      this.uldForm.get('uLDMetaData')?.get('weightUnitId')?.patchValue('bc1e3d49-5c26-4de5-9cd4-576bbf6e9d0c');
      this.selectedULDType = uld.uldType? uld.uldType: ULDType.Pallet;;
      this.selectedULDStatus = uld.uldLocateStatus? uld.uldLocateStatus: ULDLocateStatus.OnGround;
      this.selectedULDOwnershipType = uld.uldOwnershipType? uld.uldOwnershipType: ULDOwnershipType.OwnByAirline;
      this.disableInputForEdit();
    }
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
    if (this.uldForm.valid) {
      if (this.isEditULD) {

        var editUld: UldUpdateRM = this.uldForm.value;
        console.log(this.uldForm.value);
        editUld.uLDType = this.selectedULDType;
        editUld.uLDOwnershipType = this.selectedULDOwnershipType;
        var metadata = editUld.uLDMetaData
        if(metadata != undefined) {
          metadata.volumeUnitId ='9f0928df-5d33-4e5d-affc-f7e2e2b72680';
          metadata.weightUnitId ='bc1e3d49-5c26-4de5-9cd4-576bbf6e9d0c';
        }

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
