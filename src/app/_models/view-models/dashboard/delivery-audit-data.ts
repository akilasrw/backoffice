export interface DeliveryAuditData{
    collectedDate?:Date;
    aWBs?:number;
    parcellsCollected?:number;
    parcellsRetured?:number;
    parcellsOnHold?:number;
    uLDPacked?:number;
    onRoute?:number;
    parcellsDeliverd?:number;
    oneDay?:number;
    oneDayToOneAndHalf?:number;
    afterOneAndHalf?:number;
  }

  // export interface DeliveryAuditData{
  //   DeliveryAuditData?:DeliveryAudit[];
  // }
