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
import { AircraftSubTypes } from 'src/app/core/enums/common-enums';
import { AircraftSubType } from 'src/app/_models/view-models/aircrafts/aircraft-sub-type.model';

@Component({
  selector: 'app-flight-schedule-create',
  templateUrl: './flight-schedule-create.component.html',
  styleUrls: ['./flight-schedule-create.component.scss']
})

export class FlightScheduleCreateComponent implements OnInit {

  flightList: SelectList[] = [];
  aircraftSubTypes: SelectList[] = [];
  selectedAircraftSubType: AircraftSubTypes = AircraftSubTypes.None;
  daysList: number[] = [];
  flight?: Flight;
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
  }

  ngOnInit(): void {
    this.initializeFlightScheduleForm();
    this.loadFlights();
    this.getAircraftTypes();
  }

  initializeFlightScheduleForm() {
    this.flightScheduleForm = new FormGroup({
      id: new FormControl(null),
      flightId: new FormControl(null, [Validators.required]),
      aircraftSubTypeId: new FormControl(null, [Validators.required]),
      scheduleStartDate: new FormControl(null, [Validators.required]),
      scheduleEndDate: new FormControl(null, [Validators.required]),
      daysOfWeek: new FormControl(null, [Validators.required]),
    });
  }

  loadFlights() {
    this.isLoading = true;
    this.flightService.getSelectList()
      .subscribe(res => {
        this.isLoading = false;
        if (res.length > 0) {
          this.flightList = res;
        }
      });
  }

  getAircraftTypes() {
    this.isLoading = true;
    this.aircraftService.getAircraftTypes().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.getFileredAircraftSubTypes();
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

  getFileredAircraftSubTypes() {
    this.isLoading = true;
    this.aircraftService.aircraftTypes$.subscribe(res => {
      if (res != null) {
        res.forEach(obj => {
          obj.aircraftSubTypes?.forEach(subObj => {
            this.aircraftSubTypes?.push({ id: subObj.type?.toString(), value: subObj.name });
          })
        });
      }
      this.isLoading = false;
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

  selectAircraftSubType(value: any) {
    this.selectedAircraftSubType = value.id;
  }

  onClearAircraftSubType() {
    this.selectedAircraftSubType = AircraftSubTypes.None;
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
    if (this.selectedAircraftSubType != undefined) {
      this.flightScheduleForm.get('aircraftSubTypeId')?.patchValue(this.getAircraftTypeIdByType(this.selectedAircraftSubType));
    }

    if (this.flightScheduleForm.get('aircraftSubTypeId')?.value === null || this.flightScheduleForm.get('aircraftSubTypeId')?.value === "") {
      this.toastr.error('Please select aircraft type.');
      return;
    }

    if (this.flightScheduleForm.get('flightId')?.value === null || this.flightScheduleForm.get('flightId')?.value === "") {
      this.toastr.error('Please select flight.');
      return;
    }

    if (this.flightScheduleForm.get('scheduleStartDate')?.value == null) {
      this.toastr.error('Please select start date.');
      return;
    }

    if (this.flightScheduleForm.get('scheduleEndDate')?.value == null) {
      this.toastr.error('Please select end date.');
      return;
    }

    if (this.flightScheduleForm.get('scheduleStartDate')?.value >= this.flightScheduleForm.get('scheduleEndDate')?.value) {
      this.toastr.error('The schedule end date needs to be greater than the start date.');
      return;
    }

    var time = this.flightScheduleForm.get('scheduleEndDate')?.value.getTime() - this.flightScheduleForm.get('scheduleStartDate')?.value.getTime();
    var days = time / (1000 * 3600 * 24);

    if (days < 5) {
      this.toastr.error('Please select 7 days date range.');
      return;
    }

    if (this.flightScheduleForm.get('daysOfWeek')?.value === null || this.flightScheduleForm.get('daysOfWeek')?.value === "") {
      this.toastr.error('Please select day(s) Of week.');
      return;
    }

    if (this.flightScheduleForm.valid) { debugger
      this.isLoading = true;
      var flightSchedule: FlightScheduleManagementCreateRM = this.flightScheduleForm.value;
      flightSchedule.scheduleStartDate = moment(this.flightScheduleForm.get('scheduleStartDate')?.value).format('YYYY-MM-DDThh:mm:ss');
      flightSchedule.scheduleEndDate = moment(this.flightScheduleForm.get('scheduleEndDate')?.value).format('YYYY-MM-DDThh:mm:ss');

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

  getAircraftTypeIdByType(aircraftType?: number): string {
    var typeId: string | undefined = "";

    this.aircraftService.aircraftTypes$.subscribe(res => {
      if (res != null) {
        res.forEach(obj => {
          obj.aircraftSubTypes?.forEach(subObj => {
            if (subObj.type == aircraftType) {
              typeId = subObj.id
            }
          })
        });
      }
      this.isLoading = false;
    });
    return typeId;
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

  get aircraftSubTypesEnum(): typeof AircraftSubTypes {
    return AircraftSubTypes;
  }

}
