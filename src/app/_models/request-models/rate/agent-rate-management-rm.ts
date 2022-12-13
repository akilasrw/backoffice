import { AgentRateRM } from './agent-rate-rm';
export class AgentRateManagementRM {
    id?: string;
    cargoAgentId?:string;
    originAirportId?:string;
    destinationAirportId?:string;
    startDate?:string;
    endDate?:string;
    agentRates?:AgentRateRM[];
}
