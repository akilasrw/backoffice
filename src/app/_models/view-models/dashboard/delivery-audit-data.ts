export interface DeliveryAuditData{
    CollectedDate?:Date;
    AWBs?:number;
    ParcellsCollected?:number;
    ParcellsRetured?:number;
    ParcellsOnHold?:number;
    ULDPacked?:number;
    OnRoute?:number;
    ParcellsDeliverd?:number;
    OneDay?:number;
    OneDayToOneAndHalf?:number;
    AfterOneAndHalf?:number;
  }

  // export interface DeliveryAuditData{
  //   DeliveryAuditData?:DeliveryAudit[];
  // }