import { AircraftConfigType } from "src/app/core/enums/common-enums";
import { CargoPositionDetail } from "./cargo-position-detail.model";
import { CargoPositionSummary } from "./cargo-position-summary.model";

export interface CargoBookingSummaryDetail {
    cargoPositionSummary: CargoPositionSummary;
    flightNumber: string;
    scheduledDepartureDateTime:Date;
    originAirportCode:string;
    destinationAirportCode:string;
    originAirportName:string;
    destinationAirportName:string;
    aircraftRegNo:string;
    aircraftConfigurationType: AircraftConfigType;
    cargoPositions?:CargoPositionDetail[];
}
