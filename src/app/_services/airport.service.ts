import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { BaseService } from '../core/services/base.service';
import { IPagination } from '../shared/models/pagination.model';
import { AirportFilterQuery } from '../_models/queries/airport/airport-filter-query.model';
import { Airport } from '../_models/view-models/Airport/airport.model';

@Injectable({
  providedIn: 'root'
})
export class AirportService extends BaseService {

  private readonly endpointEntityName = 'Airport';
  private readonly getFilteredListEndpoint = `${this.endpointEntityName}/GetFilteredList`;


  constructor(http: HttpClient) { super(http)}

  getFilteredList(query: AirportFilterQuery){
    var params = new HttpParams();
    if (query.countryName) {
      params = params.append("countryName", query.countryName);
    }

    if (query.airportName) {
      params = params.append("airportName", query.airportName);
    }
    
    if (query.airportCode) {
      params = params.append("airportCode", query.airportCode);
    }
    
    if (query.isCountryInclude) {
      params = params.append("isCountryInclude", query.isCountryInclude);
    }

    params = CoreExtensions.AsPaginate(params, query);

    return this.getWithParams<IPagination<Airport>>(
      this.getFilteredListEndpoint,
      params
    );
  }
  
}
