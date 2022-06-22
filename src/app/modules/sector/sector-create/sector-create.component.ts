import { SectorService } from './../../../_services/sector.service';
import { AirportService } from 'src/app/_services/airport.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SectorType } from 'src/app/core/enums/common-enums';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SectorCreateRM } from 'src/app/_models/request-models/sector/sector-create-rm';

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
  createReturnSector:boolean=false;
  public sectorForm!: FormGroup;
  isEditAirport:boolean=false;
  keyword = 'value';


  constructor(private airportService:AirportService,
    private sectorService:SectorService,
    private toastr:ToastrService) { }

  ngOnInit(): void {
    this.initializeForm()
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
  
        if (this.isEditAirport) {
          // var editAirport: AirportUpdateRM = this.sectorForm.value;
  
          // editAirport.lat = this.airportForm.value.latitudeDirection.toLowerCase() == "south"
          //   ? this.airportForm.value.lat * -1
          //   : Number(this.airportForm.value.lat);
  
          //   editAirport.lon = this.airportForm.value.longitudeDirection.toLowerCase() == "west"
          //   ? this.airportForm.value.lon * -1
          //   : Number(this.airportForm.value.lon);
  
          // this.airportService.update(editAirport).subscribe({
          //   next: (res) => {
          //     this.toastr.success('Successfully update airport.');
          //     this.submitSuccess.emit();
          //     this.closeModal();
          //   },
          //   error: (err) => {
          //     this.toastr.error('Unable to update airport.');
          //   }
          // })
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
