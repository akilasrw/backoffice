import { BookingStatus, VerifyStatus } from "src/app/core/enums/common-enums";

export interface CargoBooking {
  id:string;
  bookingNumber: string;
  bookingDate: Date;
  awbNumber: string;
  bookingAgent: string;
  numberOfBoxes:number;
  totalWeight:number;
  totalVolume:number;
  bookingStatus: BookingStatus;
  numberOfRecBoxes:number;
  totalRecWeight:number;
  totalRecVolume:number;
  selected: boolean;
  verifyStatus: VerifyStatus;
  newRecord: boolean;
}
