import { ULDLocateStatus, ULDOwnershipType, ULDType } from "src/app/core/enums/common-enums";

export class UldMetadataCreateRM{
    width?:number;
    length?:number;
    height?:number;
    weight?:number;
    maxWeight?:number;
    maxVolume?:number;
    volumeUnitId?: string;
    weightUnitId?: string;
}
