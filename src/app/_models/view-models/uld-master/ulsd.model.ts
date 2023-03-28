import { ULDLocateStatus, ULDOwnershipType, ULDType } from "src/app/core/enums/common-enums";
import { BaseVM } from "src/app/shared/models/base-vm.model";

export class ULD extends BaseVM{
    uLDType?: ULDType;
    serialNumber?: string;
    uLDOwnershipType?: ULDOwnershipType;
    ownerAirlineCode?:string;
    uLDLocateStatus?:ULDLocateStatus;
    lendAirlineCode?: string; 
    lastUsedDate?:Date;
    lastUsedFlightNumber?:string;
    lastLocatedAirportCode?:string;
    width?:number;
    length?:number;
    height?:number;
    weight?:number;
    maxWeight?:number;
    maxVolume?:number;
}
