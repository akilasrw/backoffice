import { AircraftConfigType } from "src/app/core/enums/common-enums";

export interface CargoBookingSummary {
    flightNumber:string;
    scheduledDepartureDateTime:Date;
    originAirportCode:string;
    destinationAirportCode:string;
    originAirportName:string;
    destinationAirportName:string;
    aircraftRegNo:string;
    aircraftConfigurationType:AircraftConfigType;
}
