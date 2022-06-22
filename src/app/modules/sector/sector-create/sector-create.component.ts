import { AirportService } from 'src/app/_services/airport.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SectorType } from 'src/app/core/enums/common-enums';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  createReturnSector:boolean=false;
  sectorForm!: FormGroup;
  keyword = 'value';


  constructor(private airportService:AirportService) { }

  ngOnInit(): void {
    console.log("Hello");
    this.loadSectorTypes();
    this.loadAirports();
  }

  loadSectorTypes(){
    this.sectorTypes.push({id:'0',value:'All'},{id:'1',value:CoreExtensions.GetSectorType(SectorType.Domestic)},{id:'2',value:CoreExtensions.GetSectorType(SectorType.International)});
  }

  loadAirports() {
    this.airportService.getSelectList()
      .subscribe(res => {
        if (res.length > 0) {
          this.originAirpots = res;
          Object.assign(this.destinationAirpots, res);
        }
      });
  }

  initializeForm(){
    this.sectorForm= new FormGroup({
      originAirportId: new FormControl(null, [Validators.required]),
      destinationAirportId: new FormControl(null, [Validators.required]),
      sectorType : new FormControl(null, [Validators.required]),
      isCreateReturnSector: new FormControl(false)
    });
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
    
  }

}
