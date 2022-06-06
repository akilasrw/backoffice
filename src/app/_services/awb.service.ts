import { BaseService } from './../core/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AWBStack } from '../_models/view-models/awb/awb-stack.model';
import { AWBStckRequest } from '../_models/request-models/awb/awb-stack-request.model';

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

}
