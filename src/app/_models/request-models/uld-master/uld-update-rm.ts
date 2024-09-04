import { ULDLocateStatus, ULDOwnershipType, ULDType } from "src/app/core/enums/common-enums";
import { UldMetadataUpdateRM } from "./uld-metadata-update-rm";

export class UldUpdateRM {
    id?: string;
    uLDType?: ULDType;
    serialNumber?: string;
    uLDOwnershipType?: ULDOwnershipType;
    ownerAirlineCode?:string;
    uLDLocateStatus?:ULDLocateStatus;
    lendAirlineCode?: string;
    uLDMetaData?: UldMetadataUpdateRM;
    uldMetaDataId?: string;
    airportID?:string;
}
