import { SectorType } from "src/app/core/enums/common-enums";

export class Sector{    
    id?:string;
    originAirportId?:string;
    destinationAirportId?: string;
    originAirportCode?: string;
    destinationAirportCode?: string;
    originAirportName?: string;
    destinationAirportName?:string;
    sectorType?:SectorType;
  }