import { SectorType } from './../../../core/enums/common-enums';
export class SectorUpdateRM{
    id?:string;
    originAirportId?:string;
    originAirportCode?:string;
    destinationAirportId?:string;
    destinationAirportCode?:string;
    sectorType?:SectorType;

}
