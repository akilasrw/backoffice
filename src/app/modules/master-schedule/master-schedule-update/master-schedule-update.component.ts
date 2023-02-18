import { ScheduleStatus } from './../../../core/enums/common-enums';
import { AircraftService } from './../../../_services/aircraft.service';
import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { formatDate, formatNumber } from '@angular/common';
import { CommonMessages } from 'src/app/core/constants/common-messages';
import { AircraftSchedule } from 'src/app/_models/view-models/aircraft-schedule/aircraft-schedule.model';
import { AircraftScheduleService } from 'src/app/_services/aircraft-schedule.service';
import { ScheduleUpdateRM } from 'src/app/_models/request-models/aircraft-schedule/schedule-update-rm';
@Component({
  selector: 'app-master-schedule-update',
  templateUrl: './master-schedule-update.component.html',
  styleUrls: ['./master-schedule-update.component.scss']
})
export class MasterScheduleUpdateComponent implements OnInit {

  keyword = 'value';
  startMinDate = new Date();
  endMinDate = new Date();
  isLoading: boolean = false;
  scheduleForm!: FormGroup;
  aircraftList: SelectList[] = [];
  scheduleStatus: SelectList[] = [];
  editScheduleStatusIndex?: number;
  editAircraftIndex?: number;
  @Input() editAircraftSchedule: AircraftSchedule = new AircraftSchedule();
  @Output() submitSuccess = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<any>();
  isFlightAvilable: boolean = false;
  modalVisibleAnimateDelete: boolean = false;
  modalVisibleDelete: boolean = false;

  constructor(private aircraftService: AircraftService,
    @Inject(LOCALE_ID) private locale: string,
    private toastr: ToastrService,
    private scheduleService: AircraftScheduleService) { }

  ngOnInit(): void {
    this.loadAircrafts();
    this.loadScheduleStatus();
    this.initializeForm();
    if (this.editAircraftSchedule.aircraftScheduleFlights != null &&
      this.editAircraftSchedule.aircraftScheduleFlights.length > 0) {
      this.isFlightAvilable = true;
    }
  }

  loadAircrafts() {
    this.aircraftService.getAircraftSelectList()
      .subscribe(res => {
        if (res.length > 0) {
          this.aircraftList = res;
          if (this.editAircraftSchedule != null) {
            this.editAircraftIndex = this.aircraftList.findIndex(x => x.id == this.editAircraftSchedule!.aircraftId);
          }
        }
      });
  }

  loadScheduleStatus() {
    this.scheduleStatus.push({ id: ScheduleStatus.Schedule.toString(), value: CoreExtensions.GetScheduleStaus(ScheduleStatus.Schedule) },
      { id: ScheduleStatus.Chartered.toString(), value: CoreExtensions.GetScheduleStaus(ScheduleStatus.Chartered) },
      { id: ScheduleStatus.Maintainance.toString(), value: CoreExtensions.GetScheduleStaus(ScheduleStatus.Maintainance) }
    );
    if (this.editAircraftSchedule != null) {
      this.editScheduleStatusIndex = this.scheduleStatus.findIndex(x => x.id == this.editAircraftSchedule!.scheduleStatus?.toString());
    }
  }

  initializeForm() {
    this.scheduleForm = new FormGroup({
      id: new FormControl(null),
      scheduleStatus: new FormControl(null, [Validators.required]),
      aircraftId: new FormControl(null, [Validators.required]),
      scheduleStartDateTime: new FormControl(null, [Validators.required]),
      scheduleStartTimeHr: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(23), Validators.pattern("^[0-9]*$")]),
      scheduleStartTimeMin: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(59)]),
      scheduleEndDateTime: new FormControl(null, [Validators.required]),
      scheduleEndTimeHr: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(23), Validators.pattern("^[0-9]*$")]),
      scheduleEndTimeMin: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(59)]),
      isCompleted: new FormControl(true)
    });
    if (this.editAircraftSchedule != null) {
      this.editAircraftScheduleForm(this.editAircraftSchedule);
    }
  }

  editAircraftScheduleForm(schedule: AircraftSchedule) {
    this.scheduleForm.get('id')?.patchValue(schedule.id);
    this.scheduleForm.get('scheduleStatus')?.patchValue(schedule.scheduleStatus);
    this.scheduleForm.get('aircraftId')?.patchValue(schedule.aircraftId);
    this.scheduleForm.get('scheduleStartDateTime')?.patchValue(formatDate(schedule.scheduleStartDateTime!.toString(), 'MM-dd-yyyy', 'en-US'));
    this.scheduleForm.get('scheduleEndDateTime')?.patchValue(formatDate(schedule.scheduleEndDateTime!.toString(), 'MM-dd-yyyy', 'en-US'));
    this.scheduleForm.get('scheduleStartTimeHr')?.patchValue(this.getHours(schedule.scheduleStartDateTime));
    this.scheduleForm.get('scheduleStartTimeMin')?.patchValue(this.getMinutes(schedule.scheduleStartDateTime));
    this.scheduleForm.get('scheduleEndTimeHr')?.patchValue(this.getHours(schedule.scheduleEndDateTime));
    this.scheduleForm.get('scheduleEndTimeMin')?.patchValue(this.getMinutes(schedule.scheduleEndDateTime));
    this.scheduleForm.get('isCompleted')?.patchValue(schedule.isCompleted);
  }

  getHours(value?: Date) {
    if (value == null) return 0;
    var time = new Date(value);
    var hour = formatNumber(time.getHours(), this.locale, '2.0');
    return hour;
  }

  getMinutes(value?: Date) {
    if (value == null) return 0;
    var time = new Date(value);
    var minutes = formatNumber(time.getMinutes(), this.locale, '2.0');
    return minutes;
  }

  selectedAircraft(value: any) {
    this.scheduleForm.get('aircraftId')?.patchValue(value.id);
  }

  onClearAircraft() {
    this.scheduleForm.get('aircraftId')?.patchValue(null);
  }

  onClearStatus() {
    this.scheduleForm.get('scheduleStatus')?.patchValue(null);
  }

  selectedStatus(value: any) {
    this.scheduleForm.get('scheduleStatus')?.patchValue(Number(value.id));
  }

  editScheduleDetails() {
    if (this.isFlightAvilable) {
      this.toastr.error('Unable to update. Flights already assigned.');
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

    if (this.scheduleForm.get('scheduleStartDateTime')?.value == null) {
      this.toastr.error('Please select start date.');
      return;
    }

    if (this.scheduleForm.get('scheduleEndDateTime')?.value == null) {
      this.toastr.error('Please select end date.');
      return;
    }


    if (this.scheduleForm.valid) {
      var request = new ScheduleUpdateRM();
      request = this.scheduleForm.value;
      request.scheduleStartDate = this.scheduleForm.value.scheduleStartDateTime;
      request.scheduleEndDate = this.scheduleForm.value.scheduleEndDateTime;

      if (request.scheduleStartDate != null && request.scheduleEndDate != null) {
        let startDate = new Date(request.scheduleStartDate);
        let scheduleStartTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), this.scheduleForm.get('scheduleStartTimeHr')?.value, this.scheduleForm.get('scheduleStartTimeMin')?.value, 0);
        request.scheduleStartDate = moment(scheduleStartTime).format('YYYY-MM-DD');

        let endDate = new Date(request.scheduleEndDate);
        let scheduleEndTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), this.scheduleForm.get('scheduleEndTimeHr')?.value, this.scheduleForm.get('scheduleEndTimeMin')?.value, 0);
        request.scheduleEndDate = moment(scheduleEndTime).format('YYYY-MM-DD');

        request.scheduleStartTime = this.timeFormat(scheduleStartTime.toString());
        request.scheduleEndTime = this.timeFormat(scheduleEndTime.toString());

        console.log(scheduleEndTime) ;
        console.log(request.scheduleEndDate) ;

        if (scheduleStartTime.getTime() >= scheduleEndTime.getTime()) {
          this.toastr.error('The schedule end date time needs to be greater than the start date time.');
          return;
        }
      }

      this.isLoading=true;
      this.scheduleService.update(request).subscribe({
        next: (res) => {
          this.toastr.success('Successfully update schedule.');
          this.submitSuccess.emit(this.scheduleForm.get('scheduleStartDateTime')?.value);
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

  showDelete() {
    if (this.isFlightAvilable) {
      this.toastr.error('Unable to delete. Flights already assigned.');
      return;
    }
    this.modalVisibleDelete = true;
    setTimeout(() => (this.modalVisibleAnimateDelete = true));
  }

  cancelDelete() {
    this.modalVisibleAnimateDelete = false;
    setTimeout(() => (this.modalVisibleDelete = false), 300);
  }

  onDelete() {
    if (this.editAircraftSchedule.id) {
      this.isLoading=true;
      this.scheduleService.deleteSchedule(this.editAircraftSchedule.id)
        .subscribe({
          next: (res) => {
            this.toastr.success(CommonMessages.DeletedSuccessMsg);
            this.submitSuccess.emit(this.scheduleForm.get('scheduleStartDateTime')?.value);
            this.cancelDelete();
            this.closeModal();
            this.isLoading=false;

          },
          error: (error) => {
            this.toastr.error(CommonMessages.DeleteFailMsg);
            this.cancelDelete();
            this.isLoading=false;
          }
        });
    }
  }

  closeModal() {
    this.closePopup.emit();
  }

}
