import { Injectable } from '@angular/core';
import { BaseService } from '../core/services/base.service';
import { HttpClient } from '@angular/common/http';
import { CargoBookingStandbyUpdateRm } from '../_models/request-models/cargo-bookings/cargo-booking-standby-update-rm.model';

@Injectable({
  providedIn: 'root'
})
export class UldBookingService extends BaseService{

  private readonly endpointEntityName = 'ULDCargoBooking';
  private readonly updateStandByEndpoint = `${this.endpointEntityName}/StandByUpdate`;


  constructor(http: HttpClient) {
    super(http);
  }

  updateStandByStatus(cargoBookingStandByUpdateRM: CargoBookingStandbyUpdateRm){
    return this.put<any>(this.updateStandByEndpoint, cargoBookingStandByUpdateRM);
  }
}
