import { BaseVM } from "src/app/shared/models/base-vm.model";

export class Airport extends BaseVM{
    name?: string;
    code?: string;
    countryName?: string;
    countryId?:string;
    lat?:number;
    lon?: number; 
}
