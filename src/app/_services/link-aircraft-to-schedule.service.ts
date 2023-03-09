import { BaseService } from './../core/services/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPagination } from '../shared/models/pagination.model';
import { FlightScheduleManagementLinkFilterList } from '../_models/queries/link-aircraft/flight-schedule-management-link-filter-list.model';
import { ScheduleAircraftRm } from '../_models/request-models/link-aircraft/schedule-aircraft-rm.model';
import { FlightScheduleLink } from '../_models/view-models/link-aircraft/flight-schedule-link.model';
import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { UpdateAtaRm } from '../_models/request-models/link-aircraft/update-ata-rm.model';

@Injectable({
  providedIn: 'root'
})
export class LinkAircraftToScheduleService extends BaseService{
  private readonly endpointEntityName = 'LinkAircraftToSchedule';
  private readonly getFilteredListEndpoint = `${this.endpointEntityName}/GetFilteredList`;

  constructor(http: HttpClient) { super(http)}

  create(scheduleAircrat: ScheduleAircraftRm) {
    return this.post<any>(this.endpointEntityName, scheduleAircrat);
  }

  getFilteredList(query: FlightScheduleManagementLinkFilterList) {
    var params = new HttpParams();
    if (query.flightNumber) {
      params = params.append("flightNumber", query.flightNumber);
    }

    if (query.flightDate) {
      params = params.append("flightDate", query.flightDate.toDateString());
    }

    if (query.originAirportId) {
      params = params.append("originAirportId", query.originAirportId);
    }

    if (query.destinationAirportId) {
      params = params.append("destinationAirportId", query.destinationAirportId);
    }

    if (query.status) {
      params = params.append("status", Number(query.status));
    }
    if (query.isHistory) {
      params = params.append("isHistory", Boolean(query.isHistory));
    }

    params = CoreExtensions.AsPaginate(params, query);

    return this.getWithParams<IPagination<FlightScheduleLink>>(
      this.getFilteredListEndpoint,
      params
    );
  }

}
