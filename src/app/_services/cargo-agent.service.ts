import { HttpClient } from '@angular/common/http';
import { BaseService } from './../core/services/base.service';
import { Injectable } from '@angular/core';
import { SelectList } from '../shared/models/select-list.model';

@Injectable({
  providedIn: 'root'
})
export class CargoAgentService extends BaseService {

  private readonly endpointEntityName = 'CargoAgent';
  private readonly getSelectListEndpoint = `${this.endpointEntityName}/getSelectList`;


  constructor(http: HttpClient){super(http)}

  getAgentList(){
    return this.get<SelectList[]>(`${this.getSelectListEndpoint}`);
  }
}
