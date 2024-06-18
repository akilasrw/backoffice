import { WeightType } from "src/app/core/enums/common-enums";
import { BaseVM } from "src/app/shared/models/base-vm.model";

export class AgentRate extends BaseVM{
    agentRateManagementId?:string;
    rate?: number;
    weightType?:WeightType;
}

export interface SubCategorytype {
    categoryName: string,
    categoryType: number,
    id: string
}

export interface ChildCategorytype {
    categoryName: string,
    categoryID: number,
    id: string
}

export interface AgentOtherRatesType {
    childCategoryID: string;
    rateName: string;
    description: string;
    rateDescription: string;
    minPreceptionRate: number;
    ratePerKG: number;
    fixRate: number;
    trancheRate: number;
    iataCode: string;
    childCategory: any | null;
    id: string;
}

export enum MainRateType {
    ExportFees = 0,
    ImportFees = 1,
    MiscellaneousFees = 2
}

