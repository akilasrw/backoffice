import { PalletCreateRM } from './../../../_models/request-models/pallet-management/pallet-create-rm';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UnitType } from 'src/app/core/enums/common-enums';
import { Unit } from 'src/app/_models/view-models/unit/unit.model';
import { PalletManagementService } from 'src/app/_services/pallet-management.service';
import { UnitService } from 'src/app/_services/unit.service';
import { ToastrService } from 'ngx-toastr';
import { PalletDetail } from 'src/app/_models/view-models/pallet-management/pallet-detail.model';

@Component({
  selector: 'app-pallet-create',
  templateUrl: './pallet-create.component.html',
  styleUrls: ['./pallet-create.component.scss']
})
export class PalletCreateComponent implements OnInit {

  keyword = 'value';
  @Output() closePopup = new EventEmitter<any>();
  @Output() submitSuccess = new EventEmitter<any>();
  @Input() position?: PalletDetail;

  public palletForm!: FormGroup;
  volumeUnits: Unit[] = [];
  weightUnits: Unit[] = [];
  isLoading:boolean=false;


  constructor(
    private toastr: ToastrService,
    private palletManagementService:PalletManagementService,
    private unitService: UnitService) { }

  ngOnInit(): void {
    this.initializePalletForm();
    this.getUnits();
  }

  initializePalletForm() {
    this.palletForm = new FormGroup({
      positionId: new FormControl(this.position?.cargoPositionId),
      serialNumber: new FormControl(null, [Validators.required]),
      width: new FormControl(0, [Validators.required, Validators.min(1)]),
      length: new FormControl(0, [Validators.required, Validators.min(1)]),
      height: new FormControl(0, [Validators.required, Validators.min(1)]),
      weight: new FormControl(0, [Validators.required, Validators.min(1)]),
      volumeUnitId: new FormControl('9f0928df-5d33-4e5d-affc-f7e2e2b72680', [Validators.required]),
      weightUnitId: new FormControl('bc1e3d49-5c26-4de5-9cd4-576bbf6e9d0c', [Validators.required]),
      sequence: new FormControl(this.position?.sequence),
    });
  }

  getUnits() {
    this.unitService.getList()
      .subscribe(res => {
        this.weightUnits = res.filter(x => x.unitType == UnitType.Mass);
        this.volumeUnits = res.filter(x => x.unitType == UnitType.Length);
      });
  }


  savePalletDetails(){
    if (this.palletForm.valid){
      this.isLoading = true;
      var pallet: PalletCreateRM = this.palletForm.value;

      this.palletManagementService.create(pallet).subscribe({
        next: (res) => {
          this.toastr.success('Pallet added successfully.');
          this.submitSuccess.emit();
          this.closeModal();
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
        }
      });
      this.palletForm.markAsUntouched();
    }else {
      this.palletForm.markAllAsTouched();
    }
  }

  closeModal() {
    this.palletForm.reset();
    this.closePopup.emit();
  }
}
