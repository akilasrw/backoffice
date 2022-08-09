import { PalletPositionSearchQuery } from './../_models/queries/pallet-management/pallet-position-search-query.model';
import { BaseService } from './../core/services/base.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PalletDetail } from '../_models/view-models/pallet-management/pallet-detail.model';

@Injectable({
  providedIn: 'root'
})
export class PalletManagementService extends BaseService{

  private readonly endpointEntityName = 'PalletManagement';
  private readonly getFilteredListEndpoint = `${this.endpointEntityName}/GetFilteredPositionList`;

  constructor(http: HttpClient){super(http)}

  getFilteredList(query: PalletPositionSearchQuery){
    var params = new HttpParams();
    if (query.flightNumber) {
      params = params.append("flightNumber", query.flightNumber);
    }
    
    if (query.flightDate) {
      params = params.append("flightDate", query.flightDate.toDateString());
    }
      
    return this.getWithParams<PalletDetail[]>(
      this.getFilteredListEndpoint,
      params
    );
  }



}
