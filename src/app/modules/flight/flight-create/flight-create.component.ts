import { SectorService } from './../../../_services/sector.service';
import { Sector } from 'src/app/_models/view-models/sector/sector.model';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { SectorFilterQuery } from 'src/app/_models/queries/sector/sector-filter-query.model';
import { FlightCreateRM } from 'src/app/_models/request-models/flight/flight-create-rm';
import { FlightSectorRM } from 'src/app/_models/request-models/flight/flight-sector-rm';
import { formatNumber } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';

@Component({
  selector: 'app-flight-create',
  templateUrl: './flight-create.component.html',
  styleUrls: ['./flight-create.component.scss']
})
export class FlightCreateComponent implements OnInit {

  keyword = 'value';
  originAirports: SelectList[] = [];
  desAirports: SelectList[] = [];
  sectors: Sector[]=[];
  public flightForm!: FormGroup;
  desAirportSelectedIndex: number =-1;
  flightCreateRM: FlightCreateRM = new FlightCreateRM();
  selectedOriginAirportId: string ='';
  selectedDesAirportId: string ='';
  @ViewChild('originAriportDropdown') originAriportDropdown: any;
  @ViewChild('desAriportDropdown') desAriportDropdown: any;

  constructor(@Inject(LOCALE_ID) private locale: string,
  private fb: FormBuilder,
    private sectorService: SectorService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadSectors();
  }

  loadSectors(){
    this.sectorService.getList()
    .subscribe({
      next: (res) => {
        if (res.length > 0) {
          this.sectors = res;
          this.loadOriginSectors();
        }
      },
      error: (error) => {
      }
    });
  }

  loadOriginSectors() {
    this.sectors.forEach((value, index) => {
      let originAirport = new SelectList();
      originAirport.id = value.originAirportId;
      originAirport.value = value.originAirportCode;// + " - " + value.destinationAirportName;
      this.originAirports.push(originAirport);
      //this.originAirports.push({id: value.originAirportId, value: value.originAirportCode});
    })
  }

  initializeForm() {
    this.flightForm = this.fb.group({
      flightNumber: ['', [Validators.required]],
      flightSector: this.fb.group({
        originAirportId:[''],
        desAirportId:[''],
        flightId: [''],
        sectorId: [''],
        sequence: [0],
        departureDateDisplayTimeHr: ['',[Validators.required, Validators.min(0), Validators.max(23)]],
        departureDateDisplayTimeMin: ['',[Validators.required, Validators.min(0), Validators.max(59)]],
        arrivalDateDisplayTimeHr: ['',[Validators.required, Validators.min(0), Validators.max(23)]],
        arrivalDateDisplayTimeMin: ['',[Validators.required, Validators.min(0), Validators.max(59)]],
      })
    })
  }

  selectedOriginAirport(value: any) { debugger
    console.log(this.sectors);
      console.log(value);

      let filteredSectors = this.sectors.filter(x=> x.originAirportId == value.id);
      filteredSectors.forEach((value, index) => {
        this.desAirports.push({id: value.destinationAirportId, value: value.destinationAirportCode});
      });
      this.selectedOriginAirportId = value.id;
      //this.flightForm.get('flightSector')?.get('originAirportId')?.patchValue(value.id);
  }

  selectedDesAirport(value: any) {
    this.selectedDesAirportId = value.id;
    //this.flightForm.get('flightSector')?.get('desAirportId')?.patchValue(value.id);
  }

  clearSectorTimeInputs(){

  }

  onChangedOriginAirport() {

  }

  onClearOrigin(e:any) {
    //e.stopPropagation();
    this.desAirports = [];
    this.desAriportDropdown.clear();
  }

  onClearDesAirport() {
    this.desAriportDropdown.clear();
  }

  clearOrigin(){
    this.originAriportDropdown.clear();
  }

  addSector() { debugger
    console.log(this.flightForm);

    if(this.flightForm.valid) {
      let form = this.flightForm.value;
      this.flightCreateRM.flightNumber = form.flightNumber;

      let flightSector = new FlightSectorRM();
      flightSector.sequence = 1;
      if(this.flightCreateRM.flightSectors)
      flightSector.sequence = this.flightCreateRM.flightSectors?.length + 1;

      let selectedSector = this.sectors
      .filter(x=> x.originAirportId == this.selectedOriginAirportId &&
        x.destinationAirportId == this.selectedDesAirportId)

      if (selectedSector) {
        flightSector.sectorId = selectedSector[0].id;
      }
      let today =  new Date();
      let departureTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), form.flightSector.departureDateDisplayTimeHr,form.flightSector.departureDateDisplayTimeMin,0).toString();
      let arrivalTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), form.flightSector.arrivalDateDisplayTimeHr,form.flightSector.arrivalDateDisplayTimeMin,0).toString();

      flightSector.departureDateDisplayTime = this.timeFormat(departureTime);
      flightSector.arrivalDateDisplayTime = this.timeFormat(arrivalTime);

      if(this.flightCreateRM.flightSectors)
        this.flightCreateRM.flightSectors?.push(flightSector);
      else {
        let flightSectorList: FlightSectorRM[] = [];
        flightSectorList.push(flightSector);
        this.flightCreateRM.flightSectors = flightSectorList;

      }

      this.flightForm.controls['flightSector'].reset();
      console.log(this.flightCreateRM);
      this.clearOrigin();
      this.onClearDesAirport();
      if(selectedSector[0]){
        this.originAriportDropdown.searchInput.nativeElement.value = selectedSector[0]?.destinationAirportCode;
        this.originAriportDropdown.isDisabled = true;
      }
    } else {
      this.flightForm.markAllAsTouched();
    }
  }

  timeFormat(value: string){
    var time = new Date(value);
    var hour = formatNumber(time.getHours(),this.locale,'2.0');
    var minutes = formatNumber(time.getMinutes(), this.locale,'2.0');

    return `${hour}:${minutes}`;
  }
}
