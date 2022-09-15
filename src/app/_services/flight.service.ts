import { FlightFilterQuery } from './../_models/queries/flight/flight-filter-query.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../core/services/base.service';
import { FlightCreateRM } from '../_models/request-models/flight/flight-create-rm';
import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { IPagination } from '../shared/models/pagination.model';
import { Flight } from '../_models/view-models/flight/flight.model';

@Injectable({
  providedIn: 'root'
})
export class FlightService extends BaseService {

  private readonly endpointEntityName = 'Flight';
  private readonly getFilteredListEndpoint = `${this.endpointEntityName}/GetFilteredList`;

  constructor(http: HttpClient) { super(http)}

  create(flightCreateRM: FlightCreateRM){
    return this.post<any>(this.endpointEntityName, flightCreateRM);
  }

  getFilteredList(query: FlightFilterQuery) {
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

    return this.getWithParams<IPagination<Flight>>(
      this.getFilteredListEndpoint,
      params
    );
  }

  getFlight(query: any) {
    var params = new HttpParams();
    if (query.id) {
      params = params.append("id", query.id);
    }

    if (query.flightNumber) {
      params = params.append("flightNumber", query.flightNumber);
    }

    if (query.originAirportId) {
      params = params.append("originAirportId", query.originAirportId);
    }

    if (query.destinationAirportId) {
      params = params.append("destinationAirportId", query.destinationAirportId);
    }

    if (query.includeSectors) {
      params = params.append("includeSectors", query.includeSectors);
    }

    return this.getWithParams<Flight>(
      this.endpointEntityName,
      params
    );
  }
}
