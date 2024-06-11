import { AircraftSubTypes } from "src/app/core/enums/common-enums";

export class FlightScheduleManagementUpdateRM{
    flightId?:string;
    aircraftSubTypeId?:string;
    scheduleStartDate?:string;
    scheduleEndDate?:string;
    daysOfWeek?:string;
    flightScheduleIds?:string[];
}

export interface FlightScheduleDeleteRM{
    id:string;
}