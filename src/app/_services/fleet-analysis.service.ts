import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../core/services/base.service';
import { FlightScheduleReportQuery } from '../_models/queries/flight-schedule/flight-schedule-report-query.model';
import { AircraftIdleReport } from '../_models/view-models/aircraft-schedule/aircraft-idle-report.model';
import { SelectList } from '../shared/models/select-list.model';

@Injectable({
  providedIn: 'root'
})
export class FleetAnalysisService extends BaseService {

  private readonly endpointEntityName = 'FleetAnalysis';
  private readonly getAircraftsIdleReportEndpoint = `${this.endpointEntityName}/GetAircraftsIdleReport`;


  private readonly getAircraftsEndpoint = `Aircraft/getAssignedList`;


  constructor(http: HttpClient) { super(http)

  }


  getAircrafts(){
    return this.get<SelectList[]>(this.getAircraftsEndpoint);
  }

  getAircraftScheduleList(query: FlightScheduleReportQuery){
    var params = new HttpParams();
    if (query.month) {
      params = params.append("month", query.month);
    }
    if (query.year) {
      params = params.append("year", query.year);
    }
    if (query.startDate) {
      params = params.append("startDate", query.startDate.toDateString());
    }
    if (query.endDate) {
      params = params.append("endDate", query.endDate.toDateString());
    }
    if (query.reportType) {
      params = params.append("flightScheduleReportType", query.reportType.toString());
    }

    if (query.aircraftId) {
      params = params.append("AircraftID", query.aircraftId);
    }
    return this.getWithParams<AircraftIdleReport[]>(this.getAircraftsIdleReportEndpoint,params);
  }

}

