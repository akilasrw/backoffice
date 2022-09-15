import { SectorType } from "src/app/core/enums/common-enums";
import { BaseVM } from "src/app/shared/models/base-vm.model";

export class Sector extends BaseVM{    
    originAirportId?:string;
    destinationAirportId?: string;
    originAirportCode?: string;
    destinationAirportCode?: string;
    originAirportName?: string;
    destinationAirportName?:string;
    sectorType?:SectorType;
  }