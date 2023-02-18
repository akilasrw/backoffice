import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../core/services/base.service';
import { MasterScheduleListQuery } from '../_models/queries/aircraft-schedule/master-schedule-list-query.model';
import { ScheduleCreateRM } from '../_models/request-models/aircraft-schedule/schedule-create-rm';
import { ScheduleUpdateRM } from '../_models/request-models/aircraft-schedule/schedule-update-rm';
import { AircraftSchedule } from '../_models/view-models/aircraft-schedule/aircraft-schedule.model';

@Injectable({
  providedIn: 'root'
})
export class AircraftScheduleService extends BaseService{

  private readonly endpointEntityName = 'MasterSchedule';
  private readonly getAircraftScheduleEndpoint = `${this.endpointEntityName}/GetAircraftSchedule`;


  constructor(http: HttpClient) { super(http)

  }
  
  create(scheduleCreateRM: ScheduleCreateRM){
    return this.post<any>(this.endpointEntityName, scheduleCreateRM);
  }

  getAircraftScheduleList(query: MasterScheduleListQuery){
    var params = new HttpParams();
    if (query.scheduleStartDate) {
      params = params.append("scheduleStartDate", query.scheduleStartDate.toDateString());
    }
    if (query.scheduleEndDate) {
      params = params.append("scheduleEndDate", query.scheduleEndDate.toDateString());
    }
    if (query.isIncludeAircraft) {
      params = params.append("isIncludeAircraft", query.isIncludeAircraft);
    }
    if(query.isIncludeFlightSchedules){
      params = params.append("isIncludeFlightSchedules", query.isIncludeFlightSchedules);
    }
    return this.getWithParams<AircraftSchedule[]>(this.getAircraftScheduleEndpoint,params);
  }

  update(scheduleUpdateRM: ScheduleUpdateRM){
    return this.put<any>(this.endpointEntityName, scheduleUpdateRM);
  }

  deleteSchedule(id:string){
    return this.delete<boolean>(`${this.endpointEntityName}/${id}`, null);
  }

}
