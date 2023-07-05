import { Injectable } from '@angular/core';
import { BaseService } from '../core/services/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SystemUserCreateRm } from '../_models/request-models/manage-user/system-user-create-rm.model';
import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { IPagination } from '../shared/models/pagination.model';
import { SystemUserFilterQuery } from '../_models/queries/manage-user/system-user-filter-query.model';
import { SystemUserVm } from '../_models/view-models/manage-user/system-user-vm.model';
import { SystemUserStatusUpdateRm } from '../_models/request-models/manage-user/system-user-status-update-rm.model';

@Injectable({
  providedIn: 'root'
})
export class SystemUserService extends BaseService {

  private readonly endpointEntityName = 'ManageUser';
  private readonly getFilteredListEndpoint = `${this.endpointEntityName}/GetFilteredList`;
  private readonly getListEndpoint = `${this.endpointEntityName}/GetList`;
  private readonly statusUpdateEndpoint = `${this.endpointEntityName}/StatusUpdate`;

  constructor(http: HttpClient) { super(http)}

  create(systemUserCreateRm: SystemUserCreateRm){
    return this.post<any>(this.endpointEntityName, systemUserCreateRm);
  }

  getFilteredList(query: SystemUserFilterQuery){
    var params = new HttpParams();

    if(query.status){
      params = params.append("status", query.status);
    }
    if (query.name) {
      params = params.append("name", query.name);
    }

    if (query.isCountryInclude) {
      params = params.append("isCountryInclude", query.isCountryInclude);
    }

    params = CoreExtensions.AsPaginate(params, query);

    return this.getWithParams<IPagination<SystemUserVm>>(
      this.getFilteredListEndpoint,
      params
    );
  }

  statusUpdate(statusUpdateRM: SystemUserStatusUpdateRm){
    return this.put<any>(this.statusUpdateEndpoint, statusUpdateRM);
  }

}
