import { AircraftService } from 'src/app/_services/aircraft.service';
import { Component, EventEmitter, Inject, LOCALE_ID, OnInit, Output } from '@angular/core';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CalendarType, ScheduleStatus } from 'src/app/core/enums/common-enums';
import { formatNumber } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import * as moment from 'moment';
import { AircraftScheduleService } from 'src/app/_services/aircraft-schedule.service';
import { ScheduleCreateRM } from 'src/app/_models/request-models/aircraft-schedule/schedule-create-rm';

@Component({
  selector: 'app-master-schedule-create',
  templateUrl: './master-schedule-create.component.html',
  styleUrls: ['./master-schedule-create.component.scss']
})
export class MasterScheduleCreateComponent implements OnInit {

  public scheduleForm!: FormGroup;
  public selectedCalenderType: CalendarType = CalendarType.Daily;
  aircraftList: SelectList[] = [];
  scheduleStatus: SelectList[] = [];
  keyword = 'value';
  startMinDate = new Date();
  endMinDate = new Date();
  daysList: number[] = [];
  isLoading: boolean = false;
  @Output() closePopup = new EventEmitter<any>();
  @Output() submitSuccess = new EventEmitter<any>();

  constructor(
    private toastr: ToastrService,
    @Inject(LOCALE_ID) private locale: string,
    private aircraftService: AircraftService,
    private scheduleService: AircraftScheduleService) {

  }

  ngOnInit(): void {
    this.loadAircrafts();
    this.initializeForm();
    this.loadScheduleStatus();
  }

  loadScheduleStatus() {
    this.scheduleStatus.push({ id: ScheduleStatus.Schedule.toString(), value: CoreExtensions.GetScheduleStaus(ScheduleStatus.Schedule) },
      { id: ScheduleStatus.Chartered.toString(), value: CoreExtensions.GetScheduleStaus(ScheduleStatus.Chartered) },
      { id: ScheduleStatus.Maintainance.toString(), value: CoreExtensions.GetScheduleStaus(ScheduleStatus.Maintainance) }
    );
  }

  loadAircrafts() {
    this.aircraftService.getAircraftSelectList()
      .subscribe(res => {
        if (res.length > 0) {
          this.aircraftList = res;
        }
      });
  }

  initializeForm() {
    this.scheduleForm = new FormGroup({
      aircraftId: new FormControl(null, [Validators.required]),
      calendarType: new FormControl(this.selectedCalenderType, [Validators.required]),
      scheduleStatus: new FormControl(null, [Validators.required]),
      scheduleStartDate: new FormControl(null, [Validators.required]),
      scheduleEndDate: new FormControl(''),
      scheduleStartTimeHr: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(23), Validators.pattern("^[0-9]*$")]),
      scheduleStartTimeMin: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(59)]),
      numberOfHours: new FormControl(null, [Validators.required, Validators.min(0.1), Validators.max(72)]),
      daysOfWeek: new FormControl(''),
    });
  }

  get CalendarType(): typeof CalendarType {
    return CalendarType;
  }

  onChangeCalendar() {
    this.selectedCalenderType = this.scheduleForm.get('calendarType')?.value;
  }

  onClearStatus() {
    this.scheduleForm.get('scheduleStatus')?.patchValue(null);
  }

  selectedStatus(value: any) {
    this.scheduleForm.get('scheduleStatus')?.patchValue(Number(value.id));
  }

  selectedAircraft(value: any) {
    this.scheduleForm.get('aircraftId')?.patchValue(value.id);
  }

  onClearAircraft() {
    this.scheduleForm.get('aircraftId')?.patchValue(null);
  }

  saveScheduleDetails() {
    if (this.scheduleForm.get('calendarType')?.value === null || this.scheduleForm.get('calendarType')?.value === "") {
      this.toastr.error('Please select calendar type.');
      return;
    }

    if (this.scheduleForm.get('aircraftId')?.value === null || this.scheduleForm.get('aircraftId')?.value === "") {
      this.toastr.error('Please select aircraft.');
      return;
    }

    if (this.scheduleForm.get('scheduleStatus')?.value === null || this.scheduleForm.get('scheduleStatus')?.value === "") {
      this.toastr.error('Please select schedule status.');
      return;
    }

    if (this.scheduleForm.get('scheduleStartDate')?.value == null) {
      this.toastr.error('Please select start date.');
      return;
    }

    if (this.scheduleForm.get('calendarType')?.value != CalendarType.Daily) {

      if (this.scheduleForm.get('scheduleEndDate')?.value == null) {
        this.toastr.error('Please select end date.');
        return;
      }

      if (this.scheduleForm.get('scheduleStartDate')?.value > this.scheduleForm.get('scheduleEndDate')?.value) {
        this.toastr.error('The schedule end date needs to be greater than the start date.');
        return;
      }

      var time = this.scheduleForm.get('scheduleEndDate')?.value.getTime() - this.scheduleForm.get('scheduleStartDate')?.value.getTime();
      var days = time / (1000 * 3600 * 24);

      if (this.scheduleForm.get('calendarType')?.value == CalendarType.Weekly && days < 6) {
        this.toastr.error('Date range should be greater than 7 days.');
        return;
      }

      if (this.scheduleForm.get('calendarType')?.value == CalendarType.Monthly && days < 31) {
        this.toastr.error('date range should be greater than one month.');
        return;
      }

      if (this.scheduleForm.get('daysOfWeek')?.value === null || this.scheduleForm.get('daysOfWeek')?.value === "") {
        this.toastr.error('Please select day(s) Of week.');
        return;
      }

    }

    if (this.scheduleForm.valid) {
      var request = new ScheduleCreateRM();
      request = this.scheduleForm.value;
      request.scheduleStartDate = moment(this.scheduleForm.get('scheduleStartDate')?.value).format('YYYY-MM-DDThh:mm:ssZ');
      request.scheduleEndDate = (this.scheduleForm.get('calendarType')?.value != CalendarType.Daily)?moment(this.scheduleForm.get('scheduleEndDate')?.value).format('YYYY-MM-DDThh:mm:ssZ'):undefined;

      let today = new Date();
      let scheduleStartTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), this.scheduleForm.get('scheduleStartTimeHr')?.value, this.scheduleForm.get('scheduleStartTimeMin')?.value, 0).toString();

      request.scheduleStartTime = this.timeFormat(scheduleStartTime);
      this.isLoading=true;
      this.scheduleService.create(request).subscribe({
        next: (res) => {
          this.toastr.success('Successfully create schedule.');
          this.submitSuccess.emit(this.scheduleForm.get('scheduleStartDate')?.value);
          this.closeModal();
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
        }
      });
    } else {
      this.scheduleForm.markAllAsTouched();
    }
  }

  timeFormat(value: string) {
    var time = new Date(value);
    var hour = formatNumber(time.getHours(), this.locale, '2.0');
    var minutes = formatNumber(time.getMinutes(), this.locale, '2.0');
    return `${hour}:${minutes}`;
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
    this.scheduleForm.get('daysOfWeek')?.patchValue(this.daysList.toString());
  }

  closeModal() {
    this.closePopup.emit();
  }

}
