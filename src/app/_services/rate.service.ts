import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { BaseService } from '../core/services/base.service';
import { IPagination } from '../shared/models/pagination.model';
import { AgentRateFilterQuery } from '../_models/queries/rate/agent-rate-filter-query.model';
import { AgentRateQuery } from '../_models/queries/rate/agent-rate-query.model';
import { AgentRateManagementListRM } from '../_models/request-models/rate/agent-rate-management-list-rm';
import { AgentRateManagement } from '../_models/view-models/rate/agent-rate-management';

@Injectable({
  providedIn: 'root'
})
export class RateService extends BaseService{

  private readonly endpointEntityName = 'AgentRateManagement';
  private readonly getFilteredListEndpoint = `${this.endpointEntityName}/GetFilteredList`;

  constructor(http: HttpClient) { super(http)}

  getDetail(query: AgentRateQuery) {
    var params = new HttpParams();
    if (query.id) {
      params = params.append("id", query.id);
    }
    if (query.includeCargoAgent) {
      params = params.append("includeCargoAgent", query.includeCargoAgent);
    }
    return this.getWithParams<AgentRateManagement>(this.endpointEntityName,params);
  }

  create(agentRateManagementListRM: AgentRateManagementListRM){
    return this.post<any>(this.endpointEntityName, agentRateManagementListRM);
  }

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
