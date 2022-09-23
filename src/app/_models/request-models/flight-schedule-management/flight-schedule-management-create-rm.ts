import { AircraftSubTypes } from "src/app/core/enums/common-enums";

export class FlightScheduleManagementCreateRM{
    flightId?:string;
    aircraftSubTypeId?:string;
    scheduleStartDate?:string;
    scheduleEndDate?:string;
    daysOfWeek?:string;
}