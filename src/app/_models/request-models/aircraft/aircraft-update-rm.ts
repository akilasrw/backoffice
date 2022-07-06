import { AircraftConfigType, AircraftStatus } from "src/app/core/enums/common-enums";

export class AircraftUpdateRM{
    regNo?:string;
    aircraftTypeId?:string;
    aircraftSubTypeId?:string;
    configurationType?:AircraftConfigType;
    status?:AircraftStatus;
    isActive?:boolean;
}