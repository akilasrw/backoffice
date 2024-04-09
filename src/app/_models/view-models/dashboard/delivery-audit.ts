export interface BarData{
  date?:Date;
  count?:number;
}
export interface DeliveryAudit{
  Collected?:number;
  Returned?:number;
  OnHold?:number;
  SuccessRate?:number;
  BarData?:BarData[];
}




