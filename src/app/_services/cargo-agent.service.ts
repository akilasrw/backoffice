import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService } from './../core/services/base.service';
import { Injectable } from '@angular/core';
import { SelectList } from '../shared/models/select-list.model';
import { CargoAgentFilterQuery } from '../_models/queries/cargo-agent/cargo-agent-filter-query';
import { CargoAgent } from '../_models/view-models/cargo-agent/CargoAgent';
import { IPagination } from '../shared/models/pagination.model';
import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { CargoAgentStatusUpdateRM } from '../_models/request-models/cargo-agent/cargo-agent-status-update-rm';

@Injectable({
  providedIn: 'root'
})
export class CargoAgentService extends BaseService {

  private readonly endpointEntityName = 'CargoAgent';
  private readonly getSelectListEndpoint = `${this.endpointEntityName}/getSelectList`;
  private readonly getListEndpoint = `${this.endpointEntityName}/getList`;
  private readonly getFilteredListEndpoint = `${this.endpointEntityName}/GetFilteredList`;
  private readonly statusUpdateEndpoint = `${this.endpointEntityName}/StatusUpdate`;

  constructor(http: HttpClient){super(http)}

  getAgentList(){
    return this.get<SelectList[]>(`${this.getSelectListEndpoint}`);
  }

  getFilteredList(query: CargoAgentFilterQuery){
    var params = new HttpParams();
    if(query.status){
      params = params.append("status", query.status);
    }
    if (query.cargoAgentName) {
      params = params.append("cargoAgentName", query.cargoAgentName);
    }
    if(query.isAirportInclude){
      params = params.append("isAirportInclude", query.isAirportInclude);
    }
    if (query.isCountryInclude) {
      params = params.append("isCountryInclude", query.isCountryInclude);
    }
    params = CoreExtensions.AsPaginate(params, query);

    return this.getWithParams<IPagination<CargoAgent>>(
      this.getFilteredListEndpoint,
      params
    );
  }

  statusUpdate(statusUpdateRM: CargoAgentStatusUpdateRM){
    return this.put<any>(this.statusUpdateEndpoint, statusUpdateRM);
  }

  getList() {
    return this.get<any>(this.getListEndpoint);
  }

}
