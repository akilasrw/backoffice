import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../core/services/base.service";

@Injectable({
  providedIn: 'root'
})
export class HomeService extends BaseService{
  private readonly endpointEntityName = 'CargoBookingLookup';
  private readonly deliveryAudit = `${this.endpointEntityName}/DelirveryAudit`;

  constructor(http: HttpClient) {
    super(http);
  }

  
}
