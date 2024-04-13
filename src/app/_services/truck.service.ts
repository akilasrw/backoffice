import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { BaseService } from '../core/services/base.service';
import { IPagination } from '../shared/models/pagination.model';
import { TRUCK } from './../_models/view-models/truck-master/truck.model';

@Injectable({
  providedIn: 'root'
})
export class TruckService  extends BaseService{

  private readonly endpointEntityName = 'Truck';
  private readonly getFilteredListEndpoint = `${this.endpointEntityName}/GetTruckList`;


  constructor(http: HttpClient) {
    super(http);
  }
  
  getFilteredList(){
    var params = new HttpParams();


    return this.getWithParams<IPagination<TRUCK>>(
      this.getFilteredListEndpoint,
      params
    );
  }

}
