import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../core/services/base.service';
import { FlightCreateRM } from '../_models/request-models/flight/flight-create-rm';

@Injectable({
  providedIn: 'root'
})
export class FlightService extends BaseService {

  private readonly endpointEntityName = 'Flight';

  constructor(http: HttpClient) { super(http)}

  create(flightCreateRM: FlightCreateRM){
    return this.post<any>(this.endpointEntityName, flightCreateRM);
  }
}
