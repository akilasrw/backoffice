import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../core/services/base.service';
import { AWBNumberStackRequest } from '../_models/request-models/awb-number-stack/awb-number-stack-request';

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

}
