import { ULDLocateStatus, ULDOwnershipType, ULDType } from "src/app/core/enums/common-enums";
import { UldMetadataCreateRM } from "./uld-metadata-create-rm";

export class UldCreateRM{
    uLDType?: ULDType;
    serialNumber?: string;
    uLDOwnershipType?: ULDOwnershipType;
    ownerAirlineCode?:string;
    uLDLocateStatus?:ULDLocateStatus;
    lendAirlineCode?: string; 
    uLDMetaData?:UldMetadataCreateRM;
}