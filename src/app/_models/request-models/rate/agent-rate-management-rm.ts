import { AgentRateRM } from './agent-rate-rm';
export class AgentRateManagementRM{
    cargoAgentId?:string;
    originAirportId?:string;
    destinationAirportId?:string;
    agentRates?:AgentRateRM[];
}