import { AircraftSubTypes, AircraftTypes } from "src/app/core/enums/common-enums";
import { BaseVM } from 'src/app/shared/models/base-vm.model';

export class AircraftType extends BaseVM {
    name?: string;
    type?: AircraftTypes;
    aircraftSubTypes?:AircraftSubTypes[]=[];
}