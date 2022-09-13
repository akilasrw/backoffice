import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { FlightDetailQuery } from 'src/app/_models/queries/flight/flight-detail-query.model';
import { FlightSector } from 'src/app/_models/view-models/flight-sector/flight-sector.model';
import { AircraftService } from 'src/app/_services/aircraft.service';
import { FlightService } from 'src/app/_services/flight.service';

@Component({
  selector: 'app-flight-schedule-create',
  templateUrl: './flight-schedule-create.component.html',
  styleUrls: ['./flight-schedule-create.component.scss']
})
export class FlightScheduleCreateComponent implements OnInit {

  aircraftList: SelectList[] = [];
  flightList: SelectList[] = [];
  flightSectors: FlightSector[] = [];
  public flightScheduleForm!: FormGroup;
  keyword = 'value';


  constructor(private aircraftService: AircraftService,
    private flightService: FlightService
    ) { }

  ngOnInit(): void {
    this.initializeFlightScheduleForm();
    this.loadAircrafts();
    this.loadFlights();
  }

  initializeFlightScheduleForm() {
    this.flightScheduleForm = new FormGroup({
      id: new FormControl(null),
      flightId: new FormControl(null, [Validators.required]),
      aircraftId: new FormControl(null, [Validators.required]),
    });
  }

  loadAircrafts() {
    this.aircraftService.getSelectList()
      .subscribe(res => {
        if (res.length > 0) {
          this.aircraftList = res;
        }
      });
  }

  loadFlights() {
    this.flightService.getSelectList()
      .subscribe(res => {
        if (res.length > 0) {
          this.flightList = res;
        }
      });
  }

  getFlightDetails(flightId:string) {
    var query = new FlightDetailQuery();
    query.isIncludeFlightSectors=true;
    query.id = flightId;
    this.flightService.getDetails(query)
      .subscribe(res => {
        if (res != null && res.flightSectors != null) {
          this.flightSectors = res.flightSectors;
        }
      });
  }

  load() {
    this.aircraftService.getSelectList()
      .subscribe(res => {
        if (res.length > 0) {
          this.aircraftList = res;
        }
      });
  }

  selectedAircraft(value: any){
    this.flightScheduleForm.get('aircraftId')?.patchValue(value.id);
  }

  onClearAircraft(){
    this.flightScheduleForm.get('aircraftId')?.patchValue(null);
  }

  selectedFlight(value: any){
    this.flightScheduleForm.get('flightId')?.patchValue(value.id);
    this.getFlightDetails(value.id);
  }

  onClearFlight(){
    this.flightScheduleForm.get('flightId')?.patchValue(null);
    this.flightSectors= [];
  }

}
