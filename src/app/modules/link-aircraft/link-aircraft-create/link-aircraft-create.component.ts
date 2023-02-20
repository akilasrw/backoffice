import { ToastrService } from 'ngx-toastr';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { FlightScheduleVm } from 'src/app/_models/view-models/link-aircraft/flight-schedule-vm.model';
import { LinkAircraftToScheduleService } from 'src/app/_services/link-aircraft-to-schedule.service';
import * as moment from 'moment';
import { FlightScheduleService } from 'src/app/_services/flight-schedule.service';
import { FlightScheduleQuery } from 'src/app/_models/queries/flight-schedule/flight-schedule-query.model';
import { ScheduleAircraftRm } from 'src/app/_models/request-models/link-aircraft/schedule-aircraft-rm.model';

@Component({
  selector: 'app-link-aircraft-create',
  templateUrl: './link-aircraft-create.component.html',
  styleUrls: ['./link-aircraft-create.component.scss']
})
export class LinkAircraftCreateComponent implements OnInit {

  
  flightSchedules:FlightScheduleVm[]=[];
  keyword = 'value';
  isLoading: boolean = false;
  isTextLoading: boolean = false;
  @Output() submitSuccess = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<any>();
  //editAircraftIndex? :number;

  @Input() set flightMasterScheduleId(val: string) {
    this.getFlightSchedules(val);
  }

  @Input() set flightScheduleId(val: string) {
    this.getFlightSchedule(val)
  }

  constructor(private flightScheduleService : FlightScheduleService,
            private linkAircraftToScheduleService:LinkAircraftToScheduleService,
            private toastr :ToastrService) { }

  ngOnInit(): void {

  }

  loadAircraft(flightScheduleId: string) {
    return this.flightScheduleService
    .getAircraftsByFlightScheduleId(flightScheduleId);
  }

  getFlightSchedule(id: string) {
    var query = new FlightScheduleQuery();
    query.id = id;
    query.includeFlightScheduleSectors = true;
    query.includeAircrafts = true;

    this.isTextLoading = true;

    this.flightScheduleService.getFlightSchedule(query).subscribe(
      {
        next: (res) => {
          this.flightSchedules = [];
          this.flightSchedules.push(res)
          this.fillAircraft(res);
        },
        error: (error) => {
          this.isTextLoading = false;
        }
      }
    );
  }

  getFlightSchedules(flightMasterScheduleId: string) {
    var query = new FlightScheduleQuery();
    query.flightScheduleManagementId = flightMasterScheduleId
    query.includeFlightScheduleSectors = true;
    query.includeAircrafts = true;

    this.isTextLoading = true;
    this.isLoading = true;
    this.flightScheduleService.getFlightScheduleList(query).subscribe(
      {
        next: (res) => {
          this.flightSchedules = res;
          this.flightSchedules.forEach((value) =>{
            this.fillAircraft(value);
            this.isLoading = false;
          })
        },
        error: (error) => {
          this.isTextLoading = false;
        }
      }

    );
  }

  fillAircraft(value : FlightScheduleVm){
    if(value != undefined && value.id  != undefined ) {
      this.loadAircraft(value.id).subscribe( res=> {
        value.aircrafts = res
        value.aircraftList = [];
        res.forEach(r=>{
          let selectList = new SelectList();
          selectList.id= r.id;
          selectList.value = r.regNo;
          value.aircraftList?.push(selectList)
        });

        if(value?.aircraftId) {
          value.editAircraftIndex = value.aircraftList?.findIndex(x => x.id == value?.aircraftId);
        }
        this.isTextLoading = false;
      });
    }
  }

  selectedAircraft(aircraft: any,fs: FlightScheduleVm) {
    var flightShedule = this.flightSchedules.filter(x=> x.id == fs.id);
    if(flightShedule.length > 0) {
      var selectedAircraft = flightShedule[0].aircrafts?.filter(x=>x.id==aircraft?.id)
      if(flightShedule[0].aircraftId != aircraft.id) {
        flightShedule[0].aircraftId = aircraft.id;
        flightShedule[0].aircraftScheduleId = selectedAircraft && selectedAircraft.length>0 ? selectedAircraft[0].aircraftScheduleId: '';
        //flightShedule[0].id = fs.id;
        flightShedule[0].isEdited = true;
      }
    }
  }

  onClearAircraft() {

  }

  save() {
    this.isLoading = true;
    this.flightSchedules.forEach(value => {
      var scheduleAircraftRm = new ScheduleAircraftRm();
      if(value?.isEdited && value.aircraftId) {
        scheduleAircraftRm.aircraftId = value.aircraftId;
        scheduleAircraftRm.flightScheduleId = value.id;
        scheduleAircraftRm.aircraftScheduleId = value.aircraftScheduleId;
        this.isLoading = true;
        this.linkAircraftToScheduleService.create(scheduleAircraftRm).subscribe(
          {
          next: (res) => {
            let formattedDate = (moment(value.scheduledDepartureDateTime)).format('DD-MMM-YYYY')
            this.toastr.success('Assigned succesfully date of :' + formattedDate + '.');
            this.getFlightSchedules(this.flightMasterScheduleId);
            this.isLoading = false;
            this.submitSuccess.emit();
            this.close();
          },
          error: (error) => {
            this.isLoading = false;
          }
        });
      }
    });

    var editedObjects = this.flightSchedules.filter(x => x.isEdited == true);
    if(editedObjects.length == 0){
      this.toastr.warning('Nothing has been changed to save.');
      this.isLoading = false;
    }
  }

  close(){
    this.closePopup.emit();
  }

}
