import { AutoCompleteDropdownComponent } from 'src/app/shared/components/forms/auto-complete-dropdown/auto-complete-dropdown.component';
import { Aircraft } from './../../../_models/view-models/aircrafts/aircraft.model';
import { ToastrService } from 'ngx-toastr';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
  aircrafts: Aircraft[]=[];
  aircraftInputDisable?: boolean= false;
  stepCount?: number = 1;
  //@ViewChild('autoCompleteAircraft') autoCompleteAircraft!: AutoCompleteDropdownComponent;


  @Input() set flightSchedule(val: any) {
    console.log('LinkAircraftCreateComponent',val); debugger;
    this.initialiseForm();
    if(val) {
      this.selectedFlightScheduleLink = val;
      this.patchValues();
      this.fillAircraft();
    }
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
      flightNumber: [''],
      aircraftId: [''],
      aircraftScheduleId: [''],
      estimatedArrivalDateTime: [''],
      estimatedDepartureDateTime: [''],
      aircraftRegNo: [''],
      aircraftSubTypeName: [''],
      destinationAirportName: [''],
      originAirportName: [''],
      scheduledArrivalDateTime: [''],
      scheduledDepartureDateTime: [''],
      scheduledDepartureDate: [''],
      assignStatus:[''],
      offLoad:[''],
      actualDepartureDateTime:[''],
      stepCount: [],
      actualLoad:[],
      dispatch:[1]
    });
  }

  patchValues() { debugger
    if(this.selectedFlightScheduleLink)
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
    this.linkAircraftForm.get('assignStatus')?.patchValue("Not Assign");

    if(this.selectedFlightScheduleLink && this.selectedFlightScheduleLink.aircraftId) { // step 2
      this.linkAircraftForm.get('aircraftId')?.patchValue(this.selectedFlightScheduleLink.aircraftId);
      this.aircraftInputDisable = true;
      this.selectedFlightScheduleLink.stepCount = 2;
      this.stepCount = 2;
      this.linkAircraftForm.get('assignStatus')?.patchValue("Assign");

      this.linkAircraftForm?.get('estimatedArrivalDateTime')?.clearValidators();
      this.linkAircraftForm?.get('estimatedDepartureDateTime')?.clearValidators();
      this.linkAircraftForm?.get('actualDepartureDateTime')?.addValidators(Validators.required);
    } else { // step 1
      this.linkAircraftForm?.get('estimatedArrivalDateTime')?.addValidators(Validators.required);
      this.linkAircraftForm?.get('estimatedDepartureDateTime')?.addValidators(Validators.required);
      this.linkAircraftForm?.get('actualDepartureDateTime')?.clearValidators();
      this.stepCount = 1;
    }
  }

  fillAircraft() { debugger
    var fs = this.selectedFlightScheduleLink;
    if(fs != undefined && fs.id  != undefined ) {
      this.loadAircraft(fs.id).subscribe( res=> { debugger
        this.aircrafts = res;
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
    console.log('this.editAircraftIndex',this.editAircraftIndex);
  }

  loadAircraft(flightScheduleId: string) {
    return this.flightScheduleService
    .getAircraftsByFlightScheduleId(flightScheduleId);
  }

  selectedAircraft(aircraft: any) { debugger
    this.linkAircraftForm.get('aircraftId')?.patchValue(aircraft.id);

    if(this.selectedFlightScheduleLink) {
      var selectedAircraft = this.aircrafts.filter(x=>x.id==aircraft?.id)
      if(this.selectedFlightScheduleLink.aircraftId != aircraft.id) {
        this.selectedFlightScheduleLink.aircraftId = aircraft.id;
        this.selectedFlightScheduleLink.aircraftScheduleId = selectedAircraft.length > 0 ? selectedAircraft[0].aircraftScheduleId: '';
        this.selectedFlightScheduleLink.isEdit = true;

        this.linkAircraftForm.get('aircraftScheduleId')?.patchValue(this.selectedFlightScheduleLink.aircraftScheduleId);
      }
    }
}

  onClearAircraft() {
    this.editAircraftIndex=undefined;
    this.linkAircraftForm.get('aircraftId')?.patchValue(null);
    this.linkAircraftForm.get('aircraftScheduleId')?.patchValue(null);
  }


  save() { debugger
    if(this.linkAircraftForm.valid) {
      if(this.isValid()) {
        this.isLoading = true;
        var fs = this.linkAircraftForm.value;
        var scheduleAircraftRm = new ScheduleAircraftRm();
        scheduleAircraftRm.aircraftId = fs.aircraftId;
        scheduleAircraftRm.flightScheduleId = fs.id;
        scheduleAircraftRm.aircraftScheduleId = fs.aircraftScheduleId;
        scheduleAircraftRm.estimatedArrivalDateTime = fs?.estimatedArrivalDateTime;
        scheduleAircraftRm.estimatedDepartureDateTime = fs?.estimatedDepartureDateTime;
        scheduleAircraftRm.actualDepartureDateTime = fs?.actualDepartureDateTime;
        scheduleAircraftRm.stepCount = this.stepCount;
        scheduleAircraftRm.isDispatched = fs?.dispatch==1? true: false

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
    } else {
      this.linkAircraftForm.markAllAsTouched();
    }

  }

  close(){
    this.closePopup.emit();
  }

  isValid(): boolean {
    if(this.stepCount == 1) {
      if (this.linkAircraftForm.get('aircraftId')?.value === null || this.linkAircraftForm.get('aircraftId')?.value === "") {
            this.toastr.error('Please select aircraft.');
            return false;
      }
    } else {

    }

    // Can not compare, bcz next can arrive the plane
    // if(this.linkAircraftForm.value.estimatedArrivalDateTime != undefined &&
    //   this.linkAircraftForm.value.estimatedDepartureDateTime != undefined) {
    //     let today =  new Date();
    //     let departureTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), this.linkAircraftForm.value.estimatedDepartureDateTime.split(':',1), this.linkAircraftForm.value.estimatedDepartureDateTime.split(':')[1],0).toString();
    //     let arrivalTime =new Date(today.getFullYear(), today.getMonth(), today.getDate(), this.linkAircraftForm.value.estimatedArrivalDateTime.split(':',1), this.linkAircraftForm.value.estimatedArrivalDateTime.split(':')[1],0).toString();
    //     if(arrivalTime < departureTime) {
    //       this.toastr.warning("Estimated Arrival Time should be greater than Estimated Departure Time.");
    //       return false;
    //     }
    //   }
    return true;;
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
