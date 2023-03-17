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
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-link-aircraft-create',
  templateUrl: './link-aircraft-create.component.html',
  styleUrls: ['./link-aircraft-create.component.scss']
})
export class LinkAircraftCreateComponent implements OnInit {

  keyword = 'value';
  isLoading: boolean = false;
  isTextLoading: boolean = false;
  linkAircraftForm!: FormGroup;
  selectedFlightScheduleLink:FlightScheduleLink = new FlightScheduleLink();
  flightSchedules:FlightScheduleVm[]=[];
  editAircraftIndex?: number;
  aircraftList: SelectList[]=[];


  @Input() set flightSchedule(val: any) {
    console.log('LinkAircraftCreateComponent',val);

    this.selectedFlightScheduleLink = val;
    this.initialiseForm();
    this.patchValues();
  }
  @Output() submitSuccess = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<any>();

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
      aircraftId: ['', [Validators.required]],
      estimatedArrivalDateTime: ['', [Validators.required]],
      estimatedDepartureDateTime: ['', [Validators.required]],
      aircraftRegNo: [''],
      aircraftSubTypeName: [''],
      destinationAirportName: [''],
      originAirportName: [''],
      scheduledArrivalDateTime: [''],
      scheduledDepartureDateTime: [''],
      scheduledDepartureDate: [''],
      assignStatus:[''],
      offLoad:[''],
    });
  }

  patchValues() {
    this.linkAircraftForm.patchValue({
      id: this.selectedFlightScheduleLink.id,
      flightNumber: this.selectedFlightScheduleLink.flightNumber,
      // aircraftId: this.selectedFlightScheduleLink.aircraftId,
      // estimatedArrivalDateTime: this.selectedFlightScheduleLink.estimatedArrivalDateTime,
      // estimatedDepartureDateTime: this.selectedFlightScheduleLink.estimatedDepartureDateTime,
      aircraftRegNo: this.selectedFlightScheduleLink.aircraftRegNo,
      aircraftSubTypeName: this.selectedFlightScheduleLink.aircraftSubTypeName,
      destinationAirportName: this.selectedFlightScheduleLink.destinationAirportName,
      originAirportName: this.selectedFlightScheduleLink.originAirportName,
      scheduledDepartureDate: this.selectedFlightScheduleLink.scheduledDepartureDateTime? formatDate(this.selectedFlightScheduleLink.scheduledDepartureDateTime!.toString(), 'MM-dd-yyyy', 'en-US'):'',
      scheduledArrivalDateTime: this.selectedFlightScheduleLink.scheduledArrivalDateTime? formatDate(this.selectedFlightScheduleLink.scheduledArrivalDateTime, 'shortTime', 'en'):'',
      scheduledDepartureDateTime: this.selectedFlightScheduleLink.scheduledDepartureDateTime? formatDate(this.selectedFlightScheduleLink.scheduledDepartureDateTime, 'shortTime', 'en'):''
    });
  }

  fillAircraft() {
    var fs = this.selectedFlightScheduleLink;
    if(fs != undefined && fs.id  != undefined ) {
      this.loadAircraft(fs.id).subscribe( res=> {
        this.aircraftList =[];
        res.forEach(r=>{
          let selectList = new SelectList();
          selectList.id= r.id;
          selectList.value = r.regNo;
          this.aircraftList?.push(selectList)
        });

        if(fs?.aircraftId) {
          this.editAircraftIndex = this.aircraftList?.findIndex(x => x.id == fs?.aircraftId);
        }
        this.isTextLoading = false;
      });
    }
  }

  loadAircraft(flightScheduleId: string) {
    return this.flightScheduleService
    .getAircraftsByFlightScheduleId(flightScheduleId);
  }

  selectedAircraft(aircraft: any) {
    this.linkAircraftForm.value.aircraftId.patch(aircraft.id);
  }

  onClearAircraft() {

  }


  save() {
    this.isLoading = true;
    var fs = this.linkAircraftForm.value
    var scheduleAircraftRm = new ScheduleAircraftRm();
    scheduleAircraftRm.aircraftId = fs.aircraftId;
    scheduleAircraftRm.flightScheduleId = fs.id;
    scheduleAircraftRm.aircraftScheduleId = fs.aircraftScheduleId;
    scheduleAircraftRm.estimatedArrivalDateTime = fs?.estimatedArrivalDateTime;
    scheduleAircraftRm.estimatedDepartureDateTime = fs?.estimatedDepartureDateTime;
    this.isLoading = true;
    this.linkAircraftToScheduleService.create(scheduleAircraftRm).subscribe(
      {
      next: (res) => {
        // let formattedDate = (moment(value.scheduledDepartureDateTime)).format('DD-MMM-YYYY')
        this.toastr.success('Saved Successfully.');
        this.isLoading = false;
        this.submitSuccess.emit();
        this.close();
      },
      error: (error) => {
        this.isLoading = false;
      }
    });


    // var editedObjects = this.flightSchedules.filter(x => x.isEdited == true);
    // if(editedObjects.length == 0){
    //   this.toastr.warning('Nothing has been changed to save.');
    //   this.isLoading = false;
    // }
  }

  close(){
    this.closePopup.emit();
  }

  // getFlightSchedule(id: string) {
  //   var query = new FlightScheduleQuery();
  //   query.id = id;
  //   query.includeFlightScheduleSectors = true;
  //   query.includeAircrafts = true;

  //   this.isTextLoading = true;

    // this.flightScheduleService.getFlightSchedule(query).subscribe(
    //   {
    //     next: (res) => {
    //       // this.flightSchedules = [];
    //       // this.flightSchedules.push(res)
    //       // this.fillAircraft(res);
    //     },
    //     error: (error) => {
    //       this.isTextLoading = false;
    //     }
    //   }
    // );
  // }

}
