import { FlightFilterQuery } from './../_models/queries/flight/flight-filter-query.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../core/services/base.service';
import { FlightCreateRM } from '../_models/request-models/flight/flight-create-rm';
import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { IPagination } from '../shared/models/pagination.model';
import { Flight } from '../_models/view-models/flight/flight.model';
import { SelectList } from '../shared/models/select-list.model';
import { FlightDetailQuery } from '../_models/queries/flight/flight-detail-query.model';
import { FlightUpdateRM } from '../_models/request-models/flight/flight-update-rm';

@Injectable({
  providedIn: 'root'
})
export class FlightService extends BaseService {

  private readonly endpointEntityName = 'Flight';
  private readonly getFilteredListEndpoint = `${this.endpointEntityName}/GetFilteredList`;
  private readonly getSelectListEndpoint: string = `${this.endpointEntityName}/getSelectList`;
  private readonly getDetailEndpoint: string = `${this.endpointEntityName}/getDetail`;

  constructor(http: HttpClient) { super(http)}

  create(flightCreateRM: FlightCreateRM){
    return this.post<any>(this.endpointEntityName, flightCreateRM);
  }

  update(flightCreateRM: FlightCreateRM){
    return this.put<any>(`${this.endpointEntityName}/${flightCreateRM.id}`, flightCreateRM);
  }

  deleteFlight(id:string){
    return this.delete<any>(`${this.endpointEntityName}/${id}`, null);
 }

  getSelectList() {
    return this.get<SelectList[]>(`${this.getSelectListEndpoint}`);
  }

  getDetails(query: FlightDetailQuery){
    var params = new HttpParams();
    if (query.id) {
      params = params.append("id", query.id);
    }

    if (query.isIncludeFlightSectors) {
      params = params.append("isIncludeFlightSectors", query.isIncludeFlightSectors);
    }
    return this.getWithParams<Flight>(`${this.getDetailEndpoint}`, params);
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

    return this.getWithParams<FlightUpdateRM>(
      this.endpointEntityName,
      params
    );
  }
}
