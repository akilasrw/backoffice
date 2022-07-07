import { Sector } from 'src/app/_models/view-models/sector/sector.model';
import { SectorService } from './../../../_services/sector.service';
import { AirportService } from 'src/app/_services/airport.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SectorType } from 'src/app/core/enums/common-enums';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SectorCreateRM } from 'src/app/_models/request-models/sector/sector-create-rm';
import { SectorUpdateRM } from 'src/app/_models/request-models/sector/sector-update-rm';

@Component({
  selector: 'app-sector-create',
  templateUrl: './sector-create.component.html',
  styleUrls: ['./sector-create.component.scss']
})
export class SectorCreateComponent implements OnInit {

  sectorTypes: SelectList[] = [];
  originAirpots: SelectList[] = [];
  destinationAirpots: SelectList[] = [];
  @Output() closePopup = new EventEmitter<any>();
  @Output() submitSuccess = new EventEmitter<any>();
  @Input() sector:Sector = new Sector();
  editSectorTypeIndex?:number;
  editOriginAirportIndex?:number;
  editDestinationAirportIndex?:number;
  createReturnSector:boolean=false;
  public sectorForm!: FormGroup;
  isEditSector:boolean=false;
  keyword = 'value';


  constructor(private airportService:AirportService,
    private sectorService:SectorService,
    private toastr:ToastrService) { }

  ngOnInit(): void {
    this.initializeForm()
    if(this.sector != null){
      this.isEditSector = true;
      this.editSectorForm(this.sector);
    }
    this.loadSectorTypes();
    this.loadAirports();
  }

  loadSectorTypes(){
    this.sectorTypes.push({id:SectorType.None.toString(),value:'All'},{id:SectorType.Domestic.toString(),value:CoreExtensions.GetSectorType(SectorType.Domestic)},{id:SectorType.International.toString(),value:CoreExtensions.GetSectorType(SectorType.International)});
    if (this.isEditSector) {
      this.editSectorTypeIndex = this.sectorTypes.findIndex(x => x.id == this.sector.sectorType);
    }
  }

  loadAirports() {
    this.airportService.getSelectList()
      .subscribe(res => {
        if (res.length > 0) {
          this.originAirpots = res;
          Object.assign(this.destinationAirpots, res);
          if (this.isEditSector) {
            this.editOriginAirportIndex = this.originAirpots.findIndex(x => x.id == this.sector.originAirportId);
            this.editDestinationAirportIndex = this.destinationAirpots.findIndex(x => x.id == this.sector.destinationAirportId);
          }
        }
      });
  }

  initializeForm(){
    this.sectorForm= new FormGroup({
      id: new FormControl(null),
      originAirportId: new FormControl(null, [Validators.required]),
      destinationAirportId: new FormControl(null, [Validators.required]),
      sectorType : new FormControl(null, [Validators.required]),
      isCreateReturnSector: new FormControl(false)
    });
  }

  editSectorForm(sector: Sector) {
    this.sectorForm.get('id')?.patchValue(sector.id);
    this.sectorForm.get('originAirportId')?.patchValue(sector.originAirportId);
    this.sectorForm.get('destinationAirportId')?.patchValue(sector.destinationAirportId);
    this.sectorForm.get('sectorType')?.patchValue(sector.sectorType);
  }

  selectedSectorType(value: any){
    this.sectorForm.get('sectorType')?.patchValue(Number(value.id));
  }

  onClearSectorType(){
    this.sectorForm.get('sectorType')?.patchValue(null);
  }

  selectedOrigin(value: any) {
    this.sectorForm.get('originAirportId')?.patchValue(value.id);
  }

  onClearOrigin(){
    this.sectorForm.get('originAirportId')?.patchValue(null);
  }

  selectedDestination(value: any) {
    this.sectorForm.get('destinationAirportId')?.patchValue(value.id);
  }

  onClearDestination(){
    this.sectorForm.get('destinationAirportId')?.patchValue(null);
  }

  closeModal() {
    this.sectorForm.reset();
    this.closePopup.emit();
  }

  saveSectorDetails(){
 
      if (this.sectorForm.get('sectorType')?.value === null || this.sectorForm.get('sectorType')?.value === "") {
        this.toastr.error('Please select sector type.');
      }
      if (this.sectorForm.get('originAirportId')?.value === null || this.sectorForm.get('originAirportId')?.value === "") {
        this.toastr.error('Please select origin airport.');
      }
      if (this.sectorForm.get('destinationAirportId')?.value === null || this.sectorForm.get('destinationAirportId')?.value === "") {
        this.toastr.error('Please select destination airport.');
      }

      if (this.sectorForm.valid) {
  
        if (this.isEditSector) {
          var editSector: SectorUpdateRM = this.sectorForm.value;
          this.sectorService.update(editSector).subscribe({
            next: (res) => {
              this.toastr.success('Successfully update sector.');
              this.submitSuccess.emit();
              this.closeModal();
            },
            error: (err) => {
            }
          })
        } else {
          var sector: SectorCreateRM = this.sectorForm.value;
          this.sectorService.create(sector).subscribe({
            next: (res) => {
              this.toastr.success('Successfully create sector.');
              this.submitSuccess.emit();
              this.closeModal();
            },
            error: (err) => {
            }
          })
        }
      } else {
        this.sectorForm.markAllAsTouched();
      }
    
    
  }

}
