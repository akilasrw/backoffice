import {AWBDetail} from "../awb/awb-detail";
import {PackageItem} from "../booking-summary/package-item.model";
import {AWBStatus, BookingStatus} from "../../../core/enums/common-enums";

export interface CargoBookingDetail{
  bookingNumber: string;
  bookingDate: Date;
  bookingStatus: BookingStatus;
  destinationAirportCode:string;
  originAirportCode:string;
  flightNumber:string;
  destinationAirportName:string;
  destinationAirportId:string;
  scheduledDepartureDateTime:Date;
  awbInformation?:AWBDetail;
  awbStatus:AWBStatus;
  packageItems: PackageItem[];
}
