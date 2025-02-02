import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BaseService} from "../core/services/base.service";
import {DeliveryAuditQueryModel} from "../_models/queries/dashboard/delivery-audit-query.model";
import {DeliveryAudit} from "../_models/view-models/dashboard/delivery-audit";
import { DeliveryAuditData } from '../_models/view-models/dashboard/delivery-audit-data';
import { Observable } from 'rxjs';
import { PackageAudit } from '../core/enums/common-enums';

@Injectable({
  providedIn: 'root'
})
export class HomeService extends BaseService{
  private readonly endpointEntityName = 'CargoBookingLookup';
  private readonly getChatDataEndpoint = `${this.endpointEntityName}/ChartData`;
  private readonly getPackagesByDateEndpoint = `${this.endpointEntityName}/PackageByDate`;
  private readonly getDeliveryDataEndpoint = `${this.endpointEntityName}/DelirveryAudit`;

  constructor(http: HttpClient) {
    super(http);
  }


  getChartData(query: DeliveryAuditQueryModel){
    var params = new HttpParams();
    if(query.start)
    params = params.append("start", new Date(query.start).toDateString());
    if(query.end)
    params = params.append("end", new Date(query.end).toDateString());
    return this.getWithParams<DeliveryAudit>(this.getChatDataEndpoint, params);

  }

  getPackageData(query: DeliveryAuditQueryModel):Observable<PackageAudit[]>{
    var params = new HttpParams();
    if(query.start)
    params = params.append("start", new Date(query.start).toDateString());
    if(query.end)
    params = params.append("end", new Date(query.end).toDateString());
    return this.getWithParams<PackageAudit[]>(this.getPackagesByDateEndpoint, params);

  }

  getDeliveryData(query: DeliveryAuditQueryModel): Observable<DeliveryAuditData[]>{
    var params = new HttpParams();
    if(query.start)
    params = params.append("start", new Date(query.start).toDateString());
    if(query.end)
    params = params.append("end", new Date(query.end).toDateString());
    return this.getWithParams<DeliveryAuditData[]>(this.getDeliveryDataEndpoint, params);

  }
}
