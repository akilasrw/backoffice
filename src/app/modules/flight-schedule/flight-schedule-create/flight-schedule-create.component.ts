import { Aircraft } from './../../../_models/view-models/aircrafts/aircraft.model';
import { FlightScheduleManagementService } from 'src/app/_services/flight-schedule-management.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { FlightDetailQuery } from 'src/app/_models/queries/flight/flight-detail-query.model';
import { Flight } from 'src/app/_models/view-models/flight/flight.model';
import { AircraftService } from 'src/app/_services/aircraft.service';
import { FlightService } from 'src/app/_services/flight.service';
import { FlightScheduleManagementCreateRM } from 'src/app/_models/request-models/flight-schedule-management/flight-schedule-management-create-rm';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import * as moment from 'moment';

@Component({
  selector: 'app-flight-schedule-create',
  templateUrl: './flight-schedule-create.component.html',
  styleUrls: ['./flight-schedule-create.component.scss']
})
export class FlightScheduleCreateComponent implements OnInit {

  aircraftList: SelectList[] = [];
  flightList: SelectList[] = [];
  daysList: number[] = [];
  flight?: Flight;
  aircraft?: Aircraft;
  startMinDate = new Date();
  endMinDate = new Date();
  isLoading: boolean = false;
  public flightScheduleForm!: FormGroup;
  keyword = 'value';
  @Output() closePopup = new EventEmitter<any>();
  @Output() submitSuccess = new EventEmitter<any>();


  constructor(private aircraftService: AircraftService,
    private flightService: FlightService,
    private flightScheduleManagementService: FlightScheduleManagementService,
    private toastr: ToastrService
  ) { 
    this.endMinDate.setDate(this.startMinDate.getDate() + 6);
  }

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
      scheduleStartDate: new FormControl(null, [Validators.required]),
      scheduleEndDate: new FormControl(null, [Validators.required]),
      daysOfWeek: new FormControl(null, [Validators.required]),
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

  getFlightDetails(flightId: string) {
    var query = new FlightDetailQuery();
    query.isIncludeFlightSectors = true;
    query.id = flightId;
    this.flightService.getDetails(query)
      .subscribe(res => {
        if (res != null && res.flightSectors != null) {
          this.flight = res;
        }
      });
  }

  getAircraftDetails(aircraftId: string) {
    this.aircraftService.getAircraftDetail({ id: aircraftId }).subscribe({
      next: (res) => {
        this.aircraft = res
      },
      error: (error) => {

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

  selectedAircraft(value: any) {
    this.flightScheduleForm.get('aircraftId')?.patchValue(value.id);
    this.getAircraftDetails(value.id);
  }

  onClearAircraft() {
    this.flightScheduleForm.get('aircraftId')?.patchValue(null);
    this.aircraft = undefined;
  }

  selectedFlight(value: any) {
    this.flightScheduleForm.get('flightId')?.patchValue(value.id);
    this.getFlightDetails(value.id);
  }

  onClearFlight() {
    this.flightScheduleForm.get('flightId')?.patchValue(null);
    this.flight = undefined;
  }

  onChangeStartDate(){
    var selectedStartDate = this.flightScheduleForm.get('scheduleStartDate')?.value;
    this.endMinDate.setDate(selectedStartDate.getDate() + 6);
    console.log(selectedStartDate);
  }

  saveScheduleDetails() {
    if (this.flightScheduleForm.get('aircraftId')?.value === null || this.flightScheduleForm.get('aircraftId')?.value === "") {
      this.toastr.error('Please select aircraft.');
      return;
    }

    if (this.flightScheduleForm.get('flightId')?.value === null || this.flightScheduleForm.get('flightId')?.value === "") {
      this.toastr.error('Please select flight.');
      return;
    }

    if(this.flightScheduleForm.get('scheduleStartDate')?.value == null){
      this.toastr.error('Please select start date.');
      return;
    }

    if(this.flightScheduleForm.get('scheduleEndDate')?.value == null){
      this.toastr.error('Please select end date.');
      return;
    }

    if(this.flightScheduleForm.get('scheduleStartDate')?.value >= this.flightScheduleForm.get('scheduleEndDate')?.value){
      this.toastr.error('The schedule end date needs to be greater than the start date.');
      return;
    }

    if((this.flightScheduleForm.get('scheduleEndDate')?.value.getDate() - this.flightScheduleForm.get('scheduleStartDate')?.value.getDate()) < 6){
      this.toastr.error('Please select 7 days date range.');
      return;
    }

    if (this.flightScheduleForm.get('daysOfWeek')?.value === null || this.flightScheduleForm.get('daysOfWeek')?.value === "") {
      this.toastr.error('Please select day(s) Of week.');
      return;
    }
    
    if (this.flightScheduleForm.valid) {
      this.isLoading = true;
      var flightSchedule: FlightScheduleManagementCreateRM = this.flightScheduleForm.value;
      flightSchedule.scheduleStartDate = moment(this.flightScheduleForm.get('scheduleStartDate')?.value).format('YYYY-MM-DDThh:mm:ssZ');
      flightSchedule.scheduleEndDate = moment(this.flightScheduleForm.get('scheduleEndDate')?.value).format('YYYY-MM-DDThh:mm:ssZ');
      
      this.flightScheduleManagementService.create(flightSchedule).subscribe({
        next: (res) => {
          this.toastr.success('Flight schedules created successfully.');
          this.submitSuccess.emit();
          this.closeModal();
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
        }
      })
    } else {
      this.flightScheduleForm.markAllAsTouched();
    }
  }

  checkDay(checked: boolean, day: number) {
    if (checked) {
      this.daysList.push(day);
    } else {
      const index: number = this.daysList.indexOf(day);
      if (index !== -1) {
        this.daysList.splice(index, 1);
      }
    }

    this.flightScheduleForm.get('daysOfWeek')?.patchValue(this.daysList.toString());
  }

  closeModal() {
    this.flightScheduleForm.reset();
    this.closePopup.emit();
  }

  GetAircraftType(type: number) {
    return CoreExtensions.GetAircraftType(type);
  }

  GetAircraftConfigType(type: number) {
    return CoreExtensions.GetAircraftConfigType(type);
  }

}
