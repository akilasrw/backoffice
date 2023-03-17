import { CargoType, RateType } from "src/app/core/enums/common-enums";
import { BaseVM } from "src/app/shared/models/base-vm.model";
import { AgentRate } from "./agent-rate";

export class AgentRateManagement extends BaseVM{
    cargoAgentId?: string;
    originAirportId?:string;
    destinationAirportId?:string;
    originAirportCode?:string;
    destinationAirportCode?:string;
    originAirportName?:string;
    destinationAirportName?:string;
    cargoAgentName?:string;
    startDate?: Date;
    endDate?: Date;
    rateType?: RateType;
    cargoType?: CargoType;
    agentRates?:AgentRate[];
    isActive?:boolean;
}
