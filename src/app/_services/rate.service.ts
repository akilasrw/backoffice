import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { BaseService } from '../core/services/base.service';
import { IPagination } from '../shared/models/pagination.model';
import { AgentRateFilterQuery } from '../_models/queries/rate/agent-rate-filter-query.model';
import { AgentRateManagement } from '../_models/view-models/rate/agent-rate-management';

@Injectable({
  providedIn: 'root'
})
export class RateService extends BaseService{

  private readonly endpointEntityName = 'AgentRateManagement';
  private readonly getFilteredListEndpoint = `${this.endpointEntityName}/GetFilteredList`;

  constructor(http: HttpClient) { super(http)}

  getFilteredList(query: AgentRateFilterQuery) {
    var params = new HttpParams();
    if (query.cargoAgentId) {
      params = params.append("cargoAgentId", query.cargoAgentId);
    }

    if (query.originAirportId) {
      params = params.append("originAirportId", query.originAirportId);
    }

    if (query.destinationAirportId) {
      params = params.append("destinationAirportId", query.destinationAirportId);
    }

    params = CoreExtensions.AsPaginate(params, query);

    return this.getWithParams<IPagination<AgentRateManagement>>(
      this.getFilteredListEndpoint,
      params
    );
  }

}
