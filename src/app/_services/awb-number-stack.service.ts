import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { BaseService } from '../core/services/base.service';
import { IPagination } from '../shared/models/pagination.model';
import { AWBNumberStackFilterQuery } from '../_models/queries/awb-number-stack/awb-number-stack-filter-query.model';
import { AWBNumberStackRequest } from '../_models/request-models/awb-number-stack/awb-number-stack-request';
import { AWBNumberStack } from '../_models/view-models/awb-number-stack/awb-number-stack.model';

@Injectable({
  providedIn: 'root'
})
export class AwbNumberStackService extends BaseService {

  private readonly endpointEntityName = 'AWBNumberStack';
  private readonly getFilteredListEndpoint = `${this.endpointEntityName}/GetFilteredList`;

  constructor(http: HttpClient) { super(http)}

  create(awbNumberStackRequest: AWBNumberStackRequest){
    return this.post<any>(this.endpointEntityName, awbNumberStackRequest);
  }

  getFilteredList(query: AWBNumberStackFilterQuery){
    var params = new HttpParams();
    if (query.cargoAgentName) {
      params = params.append("cargoAgentName", query.cargoAgentName);
    }

    if(query.aWBNumberStatus){
      params = params.append("aWBNumberStatus", query.aWBNumberStatus);
    }

    if (query.isAgentInclude) {
      params = params.append("isAgentInclude", query.isAgentInclude);
    }

    params = CoreExtensions.AsPaginate(params, query);

    return this.getWithParams<IPagination<AWBNumberStack>>(
      this.getFilteredListEndpoint,
      params
    );
  }

}
