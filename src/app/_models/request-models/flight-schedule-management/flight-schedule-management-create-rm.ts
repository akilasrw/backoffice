import { AircraftSubTypes } from "src/app/core/enums/common-enums";

export class FlightScheduleManagementCreateRM{
    flightId?:string;
    aircraftSubType?:AircraftSubTypes;
    scheduleStartDate?:string;
    scheduleEndDate?:string;
    daysOfWeek?:string;
    isFlightScheduleGenerated?:boolean;      
}