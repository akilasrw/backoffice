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
  isLoading: boolean = false;
  public flightScheduleForm!: FormGroup;
  keyword = 'value';
  @Output() closePopup = new EventEmitter<any>();
  @Output() submitSuccess = new EventEmitter<any>();

  constructor(private aircraftService: AircraftService,
    private flightService: FlightService,
    private flightScheduleManagementService: FlightScheduleManagementService,
    private toastr: ToastrService
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
  }

  onClearAircraft() {
    this.flightScheduleForm.get('aircraftId')?.patchValue(null);
  }

  selectedFlight(value: any) {
    this.flightScheduleForm.get('flightId')?.patchValue(value.id);
    this.getFlightDetails(value.id);
  }

  onClearFlight() {
    this.flightScheduleForm.get('flightId')?.patchValue(null);
    this.flight = undefined;
  }

  saveScheduleDetails() {

    if (this.flightScheduleForm.get('daysOfWeek')?.value === null || this.flightScheduleForm.get('daysOfWeek')?.value === "") {
      this.toastr.error('Please select day(s) Of week.');
    }

    if (this.flightScheduleForm.get('aircraftId')?.value === null || this.flightScheduleForm.get('aircraftId')?.value === "") {
      this.toastr.error('Please select aircraft.');
    }

    if (this.flightScheduleForm.get('flightId')?.value === null || this.flightScheduleForm.get('flightId')?.value === "") {
      this.toastr.error('Please select flight.');
    }

    if (this.flightScheduleForm.valid) {
      this.isLoading = true;
      var flightSchedule: FlightScheduleManagementCreateRM = this.flightScheduleForm.value;
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

}
