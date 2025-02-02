import { ULDLocateStatus, ULDOwnershipType, ULDType } from "src/app/core/enums/common-enums";
import { BaseVM } from "src/app/shared/models/base-vm.model";

export class ULD extends BaseVM{
    uldType?: ULDType;
    serialNumber?: string;
    uldOwnershipType?: ULDOwnershipType;
    ownerAirlineCode?:string;
    uldLocateStatus?:ULDLocateStatus;
    lendAirlineCode?: string;
    lastFlight?:Date;
    airportID?: string;
    station?:string;
    lastUsed?:string;
    lastLocatedAirportCode?:string;
    width?:number;
    length?:number;
    height?:number;
    weight?:number;
    maxWeight?:number;
    maxVolume?:number;
    uldMetaDataId?: string;
}
