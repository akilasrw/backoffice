import { BaseVM } from "src/app/shared/models/base-vm.model";

export class CargoAgent extends BaseVM {
    agentName?: string;
    userName?:string;
    address?:string;
    primaryTelephoneNumber?:string;
    secondaryTelephoneNumber?:string;
    email?:string;
    cargoAccountNumber?:string;
    countryName?:string;
    city?:string;
    agentIATACode?:string;  
    baseAirportName?:string   
}