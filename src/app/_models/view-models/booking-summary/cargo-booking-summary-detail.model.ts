import { AircraftConfigType, AircraftSubTypes, AircraftTypes } from "src/app/core/enums/common-enums";
import { CargoPositionDetail } from "./cargo-position-detail.model";
import { CargoPositionSummary } from "./cargo-position-summary.model";
import { BookingSummaryDetailFigures } from "./booking-summary-detail-figures";

export class CargoBookingSummaryDetail {
    cargoPositionSummary?: CargoPositionSummary;
    flightNumber?: string;
    scheduledDepartureDateTime?:Date;
    originAirportCode?:string;
    destinationAirportCode?:string;
    originAirportName?:string;
    destinationAirportName?:string;
    aircraftRegNo?:string;
    aircraftConfigurationType?: AircraftConfigType;
    aircraftSubType?:AircraftSubTypes;
    aircraftType?:AircraftTypes;
    aircraftSubTypeName?: string;
    cargoPositions?:CargoPositionDetail[];
    bookingSummaryDetailFigures?: BookingSummaryDetailFigures;
}


