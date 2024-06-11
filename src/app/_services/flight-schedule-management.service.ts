import { BaseService } from '../core/services/base.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { IPagination } from '../shared/models/pagination.model';
import { FlightScheduleManagementFilterQuery } from '../_models/queries/flight-schedules-management/flight-schedule-management-filter-query.model';
import { FlightScheduleManagement } from '../_models/view-models/flight-schedules-management/flight-schedule-management';
import { FlightScheduleManagementCreateRM } from '../_models/request-models/flight-schedule-management/flight-schedule-management-create-rm';
import { FlightScheduleDeleteRM, FlightScheduleManagementUpdateRM } from '../_models/request-models/flight-schedule-management/flight-schedule-management-update-rm';

@Injectable({
  providedIn: 'root'
})
export class FlightScheduleManagementService extends BaseService {

  private readonly endpointEntityName = 'FlightScheduleManagement';
  private readonly getFilteredListEndpoint = `${this.endpointEntityName}/GetFilteredList`;


  constructor(http: HttpClient) { super(http)}

  create(flightScheduleManagementCreateRM: FlightScheduleManagementCreateRM){
    return this.post<any>(this.endpointEntityName, flightScheduleManagementCreateRM);
  }

  update(flightScheduleManagementUpdateRM: FlightScheduleManagementUpdateRM){
    return this.put<any>(this.endpointEntityName, flightScheduleManagementUpdateRM);
  }

  deleteSchedule(flightScheduleManagementDeleteRM: FlightScheduleDeleteRM){
    return this.delete<any>(`${this.endpointEntityName}/${flightScheduleManagementDeleteRM.id}`,null);
  }

  getFilteredList(query: FlightScheduleManagementFilterQuery){
    var params = new HttpParams();
    if (query.flightNumber) {
      params = params.append("flightNumber", query.flightNumber);
    }

    if (query.originAirportId) {
      params = params.append("originAirportId", query.originAirportId);
    }
    
    if (query.destinationAirportId) {
      params = params.append("destinationAirportId", query.destinationAirportId);
    }
    
    params = CoreExtensions.AsPaginate(params, query);

    return this.getWithParams<IPagination<FlightScheduleManagement>>(
      this.getFilteredListEndpoint,
      params
    );
  }

}
