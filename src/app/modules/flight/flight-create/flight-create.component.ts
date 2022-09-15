import { FlightUpdateRM } from './../../../_models/request-models/flight/flight-update-rm';
import { ToastrService } from 'ngx-toastr';
import { SectorService } from './../../../_services/sector.service';
import { Sector } from 'src/app/_models/view-models/sector/sector.model';
import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { SectorFilterQuery } from 'src/app/_models/queries/sector/sector-filter-query.model';
import { FlightCreateRM } from 'src/app/_models/request-models/flight/flight-create-rm';
import { FlightSectorRM } from 'src/app/_models/request-models/flight/flight-sector-rm';
import { formatNumber } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FlightService } from 'src/app/_services/flight.service';
import { AutoCompleteTextboxComponent } from 'src/app/shared/components/forms/auto-complete-textbox/auto-complete-textbox.component';
import { FlightQuery } from 'src/app/_models/queries/flight/flight-query.model';
import { Flight } from 'src/app/_models/view-models/flight/flight.model';

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
  initialAirportCode?: string;
  flightSectorList: FlightSectorRM[] = [];
  isLoading: boolean = false;
  @Output() closePopup = new EventEmitter<any>();
  @Output() submitSuccess = new EventEmitter<any>();
  @Input() selectedFlghtId: string = '';

  @ViewChild('originAirportTextBox') originAirportTextBox!: AutoCompleteTextboxComponent;
  @ViewChild('destinationAirportTextBox') destinationAirportTextBox!: AutoCompleteTextboxComponent;

  constructor(@Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private sectorService: SectorService,
    private flightService: FlightService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadSectors();
    this.initialValues();
    this.getFlightData();

  }

  getFlightData() { debugger
    if(this.selectedFlghtId) {
      var query = new FlightQuery();
      query.id = this.selectedFlghtId;
      query.includeSectors = true;
      this.flightService.getFlight(query)
      .subscribe(res=> {
        this.editForm(res);
      });
    }
  }

  editForm(flight: FlightUpdateRM) {debugger;
    this.flightForm.get('id')?.patchValue(flight.id);
    this.flightForm.get('flightNumber')?.patchValue(flight.flightNumber);
    this.initialAirportCode = flight?.originAirportCode;
    console.log(flight);

    if(flight?.flightSectors)
    flight?.flightSectors.forEach(val => {debugger
      let flightSector = new FlightSectorRM();
      flightSector.flightId = val.flightId;
      flightSector.sectorId = val.sectorId;
      flightSector.sequence = val.sequence;
      if(val.departureDateTime)
        flightSector.departureDateDisplayTime = this.timeFormat(val.departureDateTime);
      if(val.arrivalDateTime)
        flightSector.arrivalDateDisplayTime = this.timeFormat(val.arrivalDateTime);
      flightSector.destinationAirportCode = val.sector?.destinationAirportCode;
      flightSector.originAirportCode = val.sector?.originAirportCode;
      this.flightSectorList.push(flightSector);
      this.flightCreateRM.flightSectors = this.flightSectorList;
    });
  }

  initialValues(): void {
    this.flightForm?.get('flightSector')?.get('originAirportCode')?.valueChanges.subscribe(val => {
      this.originAirportTextChange(val);
    });
    this.flightForm?.get('flightSector')?.get('desAirportCode')?.valueChanges.subscribe(val => {
      this.destinationAirportTextChange(val);
    });
  }

  loadSectors() {
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
    this.originAirports=[];
    this.sectors.forEach((value, index) => {
      let originAirport = new SelectList();
      originAirport.id = value.originAirportId;
      originAirport.value = value.originAirportCode;
      if(this.originAirports.findIndex(x=>x.value == value.originAirportCode) < 0) {
        this.originAirports.push(originAirport);
        this.originAirportTextBox.objectList = this.originAirports;
      }
    })
  }

  initializeForm() {
    this.flightForm = this.fb.group({
      id:[null],
      flightNumber: ['', [Validators.required]],
      flightSector: this.fb.group({
        id:[null],
        originAirportId:[''],
        desAirportId:[''],
        originAirportCode:[''],
        desAirportCode:[''],
        flightId: [''],
        sectorId: [''],
        sequence: [0],
        departureDateDisplayTimeHr: ['',[Validators.required, Validators.min(0), Validators.max(23),Validators.pattern("^[0-9]*$")]],
        departureDateDisplayTimeMin: ['',[Validators.required, Validators.min(0), Validators.max(59)]],
        arrivalDateDisplayTimeHr: ['',[Validators.required, Validators.min(0), Validators.max(23)]],
        arrivalDateDisplayTimeMin: ['',[Validators.required, Validators.min(0), Validators.max(59)]],
        isEdit:[false]
      })
    });
  }

  addSector() {
    if(this.flightForm.valid) {
      let form = this.flightForm.value;
      this.flightCreateRM.flightNumber = form.flightNumber;
      if(this.selectedFlghtId == undefined || this.selectedFlghtId =='') {
        if(this.validateSectorform(form)) {
          let flightSector = new FlightSectorRM();
          flightSector.sequence = 1;
          if(this.flightCreateRM.flightSectors)
          flightSector.sequence = this.flightCreateRM.flightSectors?.length + 1;

          let selectedSector = this.sectors
          .filter(x=> x.originAirportId == this.selectedOriginAirportId &&
            x.destinationAirportId == this.selectedDesAirportId)

          if (selectedSector.length > 0) {
            flightSector.sectorId = selectedSector[0].id;
            flightSector.originAirportCode = selectedSector[0].originAirportCode;
            flightSector.destinationAirportCode = selectedSector[0].destinationAirportCode;
          }

          let today =  new Date();
          let departureTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), form.flightSector.departureDateDisplayTimeHr, form.flightSector.departureDateDisplayTimeMin,0).toString();
          let arrivalTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), form.flightSector.arrivalDateDisplayTimeHr, form.flightSector.arrivalDateDisplayTimeMin,0).toString();

          flightSector.departureDateDisplayTime = this.timeFormat(departureTime);
          flightSector.arrivalDateDisplayTime = this.timeFormat(arrivalTime);

          this.flightSectorList.push(flightSector);
          this.flightCreateRM.flightSectors = this.flightSectorList;

          if(this.flightSectorList.length == 1)
              this.initialAirportCode = flightSector?.originAirportCode;

          this.flightForm.controls['flightSector'].reset();
          if(selectedSector[0]) {
            this.flightForm?.get('flightSector')?.get('originAirportCode')?.patchValue(null);
            this.originAirportTextBox.objectList = this.originAirports;
            this.desAirports=[];
            this.originAirportTextBox.selectedText = selectedSector[0].destinationAirportCode;
            this.originAirportTextBox.isDisabled = true;
            this.flightForm.controls?.['flightSector']?.get('originAirportCode')?.disable();
            this.flightForm?.get('flightSector')?.get('originAirportCode')?.patchValue(selectedSector[0]?.destinationAirportCode);
            this.flightForm?.get('flightSector')?.get('desAirportCode')?.patchValue(null);
            this.loadDesAirport(selectedSector[0]?.destinationAirportId);
          }
        }
      } else {
        let flightSector = this.flightSectorList.filter(x=> x.id == form.flightSector.id)[0];
        let selectedSector = this.sectors
          .filter(x=> x.originAirportId == this.selectedOriginAirportId &&
            x.destinationAirportId == this.selectedDesAirportId)

          if (selectedSector.length > 0) {
            flightSector.sectorId = selectedSector[0].id;
            flightSector.originAirportCode = selectedSector[0].originAirportCode;
            flightSector.destinationAirportCode = selectedSector[0].destinationAirportCode;
          }

          let today =  new Date();
          let departureTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), form.flightSector.departureDateDisplayTimeHr, form.flightSector.departureDateDisplayTimeMin,0).toString();
          let arrivalTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), form.flightSector.arrivalDateDisplayTimeHr, form.flightSector.arrivalDateDisplayTimeMin,0).toString();

          flightSector.departureDateDisplayTime = this.timeFormat(departureTime);
          flightSector.arrivalDateDisplayTime = this.timeFormat(arrivalTime);

          this.flightForm.controls['flightSector'].reset();
          if(selectedSector[0]) {
            this.flightForm?.get('flightSector')?.get('originAirportCode')?.patchValue(null);
            this.originAirportTextBox.objectList = this.originAirports;
            this.desAirports=[];
            this.originAirportTextBox.selectedText = selectedSector[0].destinationAirportCode;
            this.originAirportTextBox.isDisabled = true;
            this.flightForm.controls?.['flightSector']?.get('originAirportCode')?.disable();
            this.flightForm?.get('flightSector')?.get('originAirportCode')?.patchValue(selectedSector[0]?.destinationAirportCode);
            this.flightForm?.get('flightSector')?.get('desAirportCode')?.patchValue(null);
            this.loadDesAirport(selectedSector[0]?.destinationAirportId);
          }
          this.flightCreateRM.flightSectors = this.flightSectorList;
      }
      console.log( this.flightSectorList);

    } else {
      this.flightForm.markAllAsTouched();
    }
  }

  save() {
    if(this.selectedFlghtId && this.selectedFlghtId != '') {

    } else {
        if(this.validateSubmit() == true) {
        this.isLoading = true;
        this.flightService.create(this.flightCreateRM).subscribe({
          next: (res) => {
            this.toastr.success('Flight created successfully.');
            this.submitSuccess.emit();
            this.closeModal();
            this.isLoading = false;
            this.clear();
          },
          error: (err) => {
            this.isLoading = false;
          }
        });
      }
    }
  }

  clear() {
    this.selectedFlghtId ='';
  }

  validateSectorform(form: any): boolean {
    if(form.departureDateDisplayTime > form.arrivalDateDisplayTime) {
      this.toastr.warning('Arrival time should be greater than Departure time');
      return false;
    }
    return true;
  }

  validateSubmit(): boolean {
    if(this.flightCreateRM == undefined ||
      this.flightCreateRM?.flightSectors == undefined ||
      this.flightCreateRM?.flightSectors?.length<1) {
        this.toastr.warning('Sector list is required.')
        return false
    }

    if(!this.flightCreateRM.flightNumber || this.flightCreateRM.flightNumber == '') {
      this.toastr.warning('Flight Number is required.')
      return false
    }
    return true;
  }

  timeFormat(value: string) {
    var time = new Date(value);
    var hour = formatNumber(time.getHours(),this.locale,'2.0');
    var minutes = formatNumber(time.getMinutes(), this.locale,'2.0');
    return `${hour}:${minutes}`;
  }

  originAirportTextChange($searchText: any) {
    if($searchText)
      this.originAirportTextBox.objectList = this.originAirports.filter(x=> x.value?.includes($searchText.toUpperCase()));
  }

  destinationAirportTextChange($searchText: any) {
    if($searchText)
      this.destinationAirportTextBox.objectList = this.desAirports.filter(x=> x.value?.includes($searchText.toUpperCase()));
  }

  originAirportSelectEvent($airportValue: SelectList) {
    this.originAirportTextBox.selectedText = $airportValue.value;
    this.flightForm?.get('flightSector')?.get('originAirportId')?.patchValue($airportValue.id);
    this.flightForm?.get('flightSector')?.get('originAirportCode')?.patchValue(this.originAirportTextBox.selectedText);
    this.loadDesAirport($airportValue.id);
  }

  destinationAirportSelectEvent($airportValue: SelectList) {
    this.destinationAirportTextBox.selectedText = $airportValue.value;
    this.flightForm?.get('flightSector')?.get('desAirportId')?.patchValue($airportValue.id);
    this.flightForm?.get('flightSector')?.get('desAirportCode')?.patchValue(this.destinationAirportTextBox.selectedText);
    if($airportValue.id)
      this.selectedDesAirportId = $airportValue.id;
  }

  loadDesAirport(id: any) {
      this.desAirports=[];
      let filteredSectors = this.sectors.filter(x=> x.originAirportId == id);
      filteredSectors.forEach((value, index) => {
        if(this.desAirports.findIndex(x=>x.value == value.destinationAirportCode) < 0)
          this.desAirports.push({id: value.destinationAirportId, value: value.destinationAirportCode});
      });
      this.selectedOriginAirportId = id;
  }

  removeflightSector() {
    this.flightSectorList.pop()
    if(this.flightSectorList.length == 0){
      this.originAirportTextBox.isDisabled = false;
      this.flightForm?.controls['flightSector'].get('originAirportCode')?.enable();
      this.flightForm?.get('flightSector')?.get('originAirportCode')?.patchValue(null);
    }
  }

  editFlightSector(sector: FlightSectorRM) { console.log('editFlightSector(sector: FlightSectorRM)', sector);
    this.flightForm.get('flightSector')?.get('originAirportCode')?.patchValue(sector.originAirportCode);
    this.originAirportTextChange(sector.originAirportCode);
    let sec = this.sectors.filter(x=> x.originAirportCode == sector.originAirportCode);
    if(sec.length>0)
     this.loadDesAirport(sec[0].originAirportId);
    if(sector.sequence ==1) {
      this.flightForm.controls?.['flightSector']?.get('originAirportCode')?.enable();
    }

    this.flightForm.get('flightSector')?.get('id')?.patchValue(sector.id);
    this.flightForm.get('flightSector')?.get('desAirportCode')?.patchValue(sector.destinationAirportCode);
    this.flightForm.get('flightSector')?.get('sequence')?.patchValue(sector.sequence);
    this.flightForm.get('flightSector')?.get('isEdit')?.patchValue(true);
    this.flightForm.get('flightSector')?.get('departureDateDisplayTimeHr')?.patchValue(sector.departureDateDisplayTime?.split(':',1));
    this.flightForm.get('flightSector')?.get('departureDateDisplayTimeMin')?.patchValue(sector.departureDateDisplayTime?.split(':')[1]);
    this.flightForm.get('flightSector')?.get('arrivalDateDisplayTimeHr')?.patchValue(sector.arrivalDateDisplayTime?.split(':',1));
    this.flightForm.get('flightSector')?.get('arrivalDateDisplayTimeMin')?.patchValue(sector.arrivalDateDisplayTime?.split(':')[1]);
  }

  closeModal() {
    this.flightSectorList =[];
    this.flightForm.reset();
    this.closePopup.emit();
  }
}
