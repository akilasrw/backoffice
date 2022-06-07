import { BaseService } from './../core/services/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AWBStack } from '../_models/view-models/awb/awb-stack.model';
import { AWBStckRequest } from '../_models/request-models/awb/awb-stack-request.model';
import { AWBStackFilterQuery } from '../_models/queries/awb/awb-stack-filter-query.model';
import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { IPagination } from '../shared/models/pagination.model';


@Injectable({
  providedIn: 'root'
})
export class AwbService extends BaseService{

  private readonly endpointEntityName = 'AWBStack';
  private readonly getLastRecordEndpoint = `${this.endpointEntityName}/GetLastRecord`;
  private readonly getFilteredListEndpoint = `${this.endpointEntityName}/GetFilteredList`;


  constructor(http: HttpClient) { super(http)}

  getLastStackItem(){
    return this.get<AWBStack>(`${this.getLastRecordEndpoint}`);
  }

  create(awbStackRequest: AWBStckRequest){
    return this.post<any>(this.endpointEntityName, awbStackRequest);
  }

  getFilteredAWBStackList(query: AWBStackFilterQuery){
    var params = new HttpParams();
    if (query.cargoAgentName) {
      params = params.append("cargoAgentName", query.cargoAgentName);
    }

    if (query.isAgentInclude) {
      params = params.append("isAgentInclude", query.isAgentInclude);
    }

    params = CoreExtensions.AsPaginate(params, query);

    return this.getWithParams<IPagination<AWBStack>>(
      this.getFilteredListEndpoint,
      params
    );
  }

}
