import { SectorType } from './../../../core/enums/common-enums';
export class SectorCreateRM{
    originAirportId?:string;
    destinationAirportId?:string;
    sectorType?:SectorType;
    isCreateReturnSector?:boolean;
}