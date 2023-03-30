import { UldCreateRM } from './../../../_models/request-models/uld-master/uld-create-rm';
import { ULDLocateStatus, ULDType, UnitType, ULDOwnershipType } from './../../../core/enums/common-enums';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Unit } from 'src/app/_models/view-models/unit/unit.model';
import { UnitService } from 'src/app/_services/unit.service';
import { ULDService } from 'src/app/_services/uld.service';
import { ToastrService } from 'ngx-toastr';

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



  constructor(private unitService: UnitService,
    private fb: FormBuilder,
    private uldService: ULDService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initializForm();
    this.getUnits();
  }

  initializForm() {
    this.uldForm = new FormGroup({
      uLDType: new FormControl(this.selectedULDType, [Validators.required]),
      serialNumber: new FormControl(null, [Validators.required]),
      uLDOwnershipType: new FormControl(this.selectedULDOwnershipType, [Validators.required]),
      ownerAirlineCode: new FormControl(null, [Validators.pattern("^[a-zA-Z]+$"), Validators.maxLength(2)]),
      uLDLocateStatus: new FormControl(this.selectedULDStatus, [Validators.required]),
      lendAirlineCode: new FormControl(null, [Validators.pattern("^[a-zA-Z]+$"), Validators.maxLength(2)]),
      uLDMetaData: this.fb.group({
        width: new FormControl(0, [Validators.required, Validators.min(1)]),
        length: new FormControl(0, [Validators.required, Validators.min(1)]),
        height: new FormControl(0, [Validators.required, Validators.min(1)]),
        weight: new FormControl(0, [Validators.required, Validators.min(1)]),
        maxWeight: new FormControl(0, [Validators.required, Validators.min(1)]),
        maxVolume: new FormControl(0, [Validators.required, Validators.min(1)]),
        volumeUnitId: new FormControl('9f0928df-5d33-4e5d-affc-f7e2e2b72680', [Validators.required]),
        weightUnitId: new FormControl('bc1e3d49-5c26-4de5-9cd4-576bbf6e9d0c', [Validators.required]),
      })
    });
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

  onChangeULDOwnershipType() {
    this.selectedULDOwnershipType = this.uldForm.get('uLDOwnershipType')?.value;
  }

  closeModal() {
    this.uldForm.reset();
    this.closePopup.emit();
  }

  saveULDDetails() {
    if (this.uldForm.valid) {
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
    } else {
      this.uldForm.markAllAsTouched();
    }
  }

}
