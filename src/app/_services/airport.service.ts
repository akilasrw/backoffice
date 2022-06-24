import { AirportUpdateRM } from './../_models/request-models/airport/airport-update-rm';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { BaseService } from '../core/services/base.service';
import { IPagination } from '../shared/models/pagination.model';
import { AirportFilterQuery } from '../_models/queries/airport/airport-filter-query.model';
import { AirportCreateRM} from '../_models/request-models/airport/airport-create-rm';
import { Airport } from 'src/app/_models/view-models/airports/airport.model';
import { SelectList } from '../shared/models/select-list.model';

@Injectable({
  providedIn: 'root'
})
export class AirportService extends BaseService {

  private readonly endpointEntityName = 'Airport';
  private readonly getFilteredListEndpoint = `${this.endpointEntityName}/GetFilteredList`;
  private readonly getSlectListEndpoint = `${this.endpointEntityName}/getSelectList`;


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

  getSelectList(){
    return this.get<SelectList[]>(this.getSlectListEndpoint);
  }

  create(airportCreateRM: AirportCreateRM){
    return this.post<any>(this.endpointEntityName, airportCreateRM);
  }

  update(airportUpdateRM: AirportUpdateRM){
    return this.put<any>(this.endpointEntityName, airportUpdateRM);
  }
  
  deleteAirport(id:string){
    return this.delete<boolean>(`${this.endpointEntityName}?id=${id}`, null);
  }
}
