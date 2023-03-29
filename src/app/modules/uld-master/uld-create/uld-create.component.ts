import { ULDType, UnitType } from './../../../core/enums/common-enums';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Unit } from 'src/app/_models/view-models/unit/unit.model';
import { UnitService } from 'src/app/_services/unit.service';

@Component({
  selector: 'app-uld-create',
  templateUrl: './uld-create.component.html',
  styleUrls: ['./uld-create.component.scss']
})
export class UldCreateComponent implements OnInit {

  isLoading:boolean = false;
  public uldForm!: FormGroup;
  selectedULDType:ULDType= ULDType.Pallet;
  volumeUnits: Unit[] = [];
  weightUnits: Unit[] = [];

  constructor(private unitService: UnitService) { }

  ngOnInit(): void {
    this.initializForm();
  }

  initializForm() {
    this.uldForm = new FormGroup({
      uLDType: new FormControl(this.selectedULDType, [Validators.required]),
      serialNumber: new FormControl(null, [Validators.required]),
      uLDOwnershipType: new FormControl(null, [Validators.required]),
      ownerAirlineCode: new FormControl(null, [Validators.required, Validators.pattern("^[a-zA-Z]+$"), Validators.maxLength(2)]),
      uLDLocateStatus: new FormControl(null, [Validators.required]),
      lendAirlineCode: new FormControl(null, [Validators.required, Validators.pattern("^[a-zA-Z]+$"), Validators.maxLength(2)]),
      lastUsedDate: new FormControl(null, [Validators.required]),
      lastUsedFlightNumber: new FormControl(null, [Validators.required]),
      lastLocatedAirportCode: new FormControl(null, [Validators.required, Validators.pattern("^[a-zA-Z]+$"), Validators.maxLength(3)]),
      width: new FormControl(0, [Validators.required, Validators.min(1)]),
      length: new FormControl(0, [Validators.required, Validators.min(1)]),
      height: new FormControl(0, [Validators.required, Validators.min(1)]),
      weight: new FormControl(0, [Validators.required, Validators.min(1)]),
      maxWeight: new FormControl(0, [Validators.required, Validators.min(1)]),
      maxVolume: new FormControl(0, [Validators.required, Validators.min(1)]),
      volumeUnitId: new FormControl('9f0928df-5d33-4e5d-affc-f7e2e2b72680', [Validators.required]),
      weightUnitId: new FormControl('bc1e3d49-5c26-4de5-9cd4-576bbf6e9d0c', [Validators.required]),
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

  onChangeULDType(){
    this.selectedULDType = this.uldForm.get('uLDType')?.value;
  }

  closeModal(){

  }

  saveULDDetails(){

  }

}
