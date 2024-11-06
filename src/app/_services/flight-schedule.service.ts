import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../core/services/base.service';
import { FlightScheduleQuery } from '../_models/queries/flight-schedule/flight-schedule-query.model';
import { UpdateAtaRm } from '../_models/request-models/link-aircraft/update-ata-rm.model';
import { Aircraft } from '../_models/view-models/aircrafts/aircraft.model';

@Injectable({
  providedIn: 'root'
})
export class FlightScheduleService extends BaseService {

  private readonly endpointEntityName = 'FlightSchedule';
  private readonly getListByMasterIdEndpoint = `${this.endpointEntityName}/GetListByMasterId`;
  private readonly getByIdAsyncEndpoint = `${this.endpointEntityName}/GetByIdAsync`;
  private readonly getAircraftsBy_FlightScheduleIdEndPoint = `${this.endpointEntityName}/GetAircraftsByFlightScheduleId`;
  private readonly updateATAEndPoint = `${this.endpointEntityName}/UpdateATA`;


  constructor(http: HttpClient) { super(http)}

  getFlightScheduleList(query: FlightScheduleQuery) {
    var params = new HttpParams();
    if (query.flightScheduleManagementId) {
      params = params.append("flightScheduleManagementId", query.flightScheduleManagementId);
    }
    if (query.includeAircrafts) {
      params = params.append("includeAircrafts", query.includeAircrafts);
    }
    if (query.includeFlightScheduleSectors) {
      params = params.append("includeFlightScheduleSectors", query.includeFlightScheduleSectors);
    }
    return this.getWithParams<any>(this.getListByMasterIdEndpoint,params);
  }

  getFlightSchedule(query: FlightScheduleQuery) {
    var params = new HttpParams();
    if (query.id) {
      params = params.append("FlightScheduleId", query?.id);
    }
    if (query.includeAircrafts) {
      params = params.append("includeAircrafts", query.includeAircrafts);
    }
    if (query.includeFlightScheduleSectors) {
      params = params.append("includeFlightScheduleSectors", query.includeFlightScheduleSectors);
    }
    return this.getWithParams<any>(this.getByIdAsyncEndpoint,params);
  }

  getAircraftsByFlightScheduleId(flightScheduleId: string) {
    return this.get<Aircraft[]>(`${this.getAircraftsBy_FlightScheduleIdEndPoint}/${flightScheduleId}`);
  }

  updateFlight(id: string, flightData: any) {
    return this.put<any>(`${this.endpointEntityName}/${id}`, flightData);
  }

  updateATA(updateAtaRm: UpdateAtaRm) {
    return this.put<any>(`${this.updateATAEndPoint}/${updateAtaRm.id}`, updateAtaRm);
  }
}
