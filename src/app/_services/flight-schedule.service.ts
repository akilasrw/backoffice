import { BaseService } from './../core/services/base.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FlightScheduleFilterQuery } from '../_models/queries/flight-schedule/flight-schedule-filter-query.model';
import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { FlightSchedule } from '../_models/view-models/flight-schedules/flight-schedule';
import { IPagination } from '../shared/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class FlightScheduleService extends BaseService {

  private readonly endpointEntityName = 'FlightSchedule';
  private readonly getFilteredListEndpoint = `${this.endpointEntityName}/GetFilteredList`;


  constructor(http: HttpClient) { super(http)}

  getFilteredList(query: FlightScheduleFilterQuery){
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

    return this.getWithParams<IPagination<FlightSchedule>>(
      this.getFilteredListEndpoint,
      params
    );
  }

}
