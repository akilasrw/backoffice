import { SectorType } from './../../../core/enums/common-enums';
export class SectorUpdateRM{
    id?:string;
    originAirportId?:string;
    destinationAirportId?:string;
    sectorType?:SectorType;
}