
import { AircraftConfigType, AircraftStatus, AircraftSubTypes, AircraftTypes } from "src/app/core/enums/common-enums";
import { BaseVM } from "src/app/shared/models/base-vm.model";

export class Aircraft extends BaseVM{
    regNo?: string;
    aircraftType?: AircraftTypes;
    aircraftSubType?: AircraftSubTypes;
    configurationType?:AircraftConfigType;
    status?:AircraftStatus;
    isActive?: boolean;
}