import { Injectable } from '@angular/core';
import { BaseService } from '../core/services/base.service';
import { HttpClient } from '@angular/common/http';
import { AgentOtherRatesType, ChildCategorytype, CreateAgentOtherRate, SubCategorytype } from '../_models/view-models/rate/agent-rate';

@Injectable({
  providedIn: 'root',
})
export class OtherRateService extends BaseService {
  private readonly endpointEntityName = 'AgentRateManagement';

  constructor(http: HttpClient) {
    super(http);
  }

  GetSubCategories(id: string) {
    return this.get<SubCategorytype[]>(`${this.endpointEntityName}/GetOtherSubRates/${id}`);
  }

  GetChildCategories(id: string) {
    return this.get<ChildCategorytype[]>(`${this.endpointEntityName}/GetOtherChildRates/${id}`);
  }

  createAgentOtherRates(data:CreateAgentOtherRate) {
    return this.post<any>(`${this.endpointEntityName}/CreateOtherRate`, data)
  }

  GetAgentOtherRates(id: string) {
    return this.get<AgentOtherRatesType[]>(`${this.endpointEntityName}/GetAgentOtherRates/${id}`);
  }
}
