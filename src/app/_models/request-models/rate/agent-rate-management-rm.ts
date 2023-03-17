import { CargoType, RateType } from 'src/app/core/enums/common-enums';
import { AgentRateRM } from './agent-rate-rm';
export class AgentRateManagementRM {
    id?: string;
    cargoAgentId?:string;
    cargoAgentName?:string;
    rateType?:RateType;
    cargoType?:CargoType;
    originAirportId?:string;
    destinationAirportId?:string;
    startDate?:string;
    endDate?:string;
    agentRates?:AgentRateRM[];
    isActive?:boolean;
}
