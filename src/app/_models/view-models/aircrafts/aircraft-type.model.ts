import { AircraftTypes } from "src/app/core/enums/common-enums";
import { BaseVM } from 'src/app/shared/models/base-vm.model';
import { AircraftSubType } from "./aircraft-sub-type.model";

export class AircraftType extends BaseVM {
    name?: string;
    type?: AircraftTypes;
    aircraftSubTypes?:AircraftSubType[]=[];
}