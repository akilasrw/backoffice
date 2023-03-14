import { ToastrService } from 'ngx-toastr';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { FlightScheduleVm } from 'src/app/_models/view-models/link-aircraft/flight-schedule-vm.model';
import { LinkAircraftToScheduleService } from 'src/app/_services/link-aircraft-to-schedule.service';
import * as moment from 'moment';
import { FlightScheduleService } from 'src/app/_services/flight-schedule.service';
import { FlightScheduleQuery } from 'src/app/_models/queries/flight-schedule/flight-schedule-query.model';
import { ScheduleAircraftRm } from 'src/app/_models/request-models/link-aircraft/schedule-aircraft-rm.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FlightScheduleLink } from 'src/app/_models/view-models/link-aircraft/flight-schedule-link.model';

@Component({
  selector: 'app-link-aircraft-create',
  templateUrl: './link-aircraft-create.component.html',
  styleUrls: ['./link-aircraft-create.component.scss']
})
export class LinkAircraftCreateComponent implements OnInit {

  keyword = 'value';
  isLoading: boolean = false;
  isTextLoading: boolean = false;
  @Output() submitSuccess = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<any>();
  linkAircraftForm!: FormGroup;
  selectedFlightScheduleLink:FlightScheduleLink = new FlightScheduleLink();

  @Input() set flightSchedule(val: any) {
    this.selectedFlightScheduleLink = val;
    this.initialiseForm();
    this.patchValues();
  }

  constructor(private flightScheduleService : FlightScheduleService,
            private linkAircraftToScheduleService:LinkAircraftToScheduleService,
            private toastr :ToastrService,
            private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  initialiseForm() {
    this.linkAircraftForm = this.fb.group({
      id:[null],
      flightNumber: ['', [Validators.required]],
    });
  }

  patchValues() {

  }


  save() {
  }

  close(){
    this.closePopup.emit();
  }

}
