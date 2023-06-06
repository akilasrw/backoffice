import { CargoType, LinkAircraftFliterStatus, MasterSheduleReportType, ULDLocateStatus, ULDOwnershipType } from 'src/app/core/enums/common-enums';
import { BookingStatus, WeightType, AWBNumberStatus, CargoAgentStatus, ScheduleStatus, RateType, ULDType } from './../enums/common-enums';
import { HttpParams } from "@angular/common/http";
import { BasePaginationQuery } from "src/app/shared/models/base-pagination-query.model";
import { AircraftActiveTypes, AircraftConfigType, AircraftStatus, AircraftSubTypes, AircraftTypes, SectorType } from "../enums/common-enums";

export class CoreExtensions {
  public static AsPaginate(
    params: HttpParams,
    filter: BasePaginationQuery
  ): HttpParams {
    if (filter.pageIndex) {
      params = params.append("pageIndex", filter.pageIndex.toString());
    }
    if (filter.pageSize) {
      params = params.append("pageSize", filter.pageSize.toString());
    }
    return params;
  }

  public static TitleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  public static PadLeadingZeros(num: number, size: number) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  public static GetSectorType(type: SectorType): string {
    let statusString = "None";
    switch (type) {
      case SectorType.None:
        statusString = "None";
        break;
      case SectorType.Domestic:
        statusString = "Domestic";
        break;
      case SectorType.International:
        statusString = "International";
        break;
      default:
        break;
    }
    return statusString;
  }

  public static GetAircraftType(type: AircraftTypes): string {
    let typeString = "None";
    switch (type) {
      case AircraftTypes.None:
        typeString = "None";
        break;
      case AircraftTypes.B7879:
        typeString = "Boeing 787-9";
        break;
      case AircraftTypes.A320200:
        typeString = "Airbus 320-200";
        break;
      case AircraftTypes.B737400:
        typeString = "Boeing 737-400";
        break;
      case AircraftTypes.B737800:
        typeString = "Boeing 737-800";
        break;
      case AircraftTypes.B737300:
        typeString = "Boeing 737-300";
        break;
      default:
        break;
    }
    return typeString;
  }

  public static GetAircraftSubType(type: AircraftSubTypes): string {
    let typeString = "None";
    switch (type) {
      case AircraftSubTypes.None:
        typeString = "None";
        break;
      case AircraftSubTypes.B7879TypeOne:
        typeString = "B787-9-TypeOne";
        break;
      case AircraftSubTypes.A320200TypeOne:
        typeString = "A320-200-TypeOne";
        break;
      case AircraftSubTypes.B737400TypeOne:
        typeString = "B737-400-TypeOne";
        break;
      case AircraftSubTypes.B737800TypeOne:
        typeString = "B737-800-TypeOne";
        break;
      case AircraftSubTypes.B737300TypeOne:
        typeString = "B737-300-TypeOne";
        break;
      default:
        break;
    }
    return typeString;
  }

  public static GetAircraftConfigType(type: AircraftConfigType): string {
    let typeString = "None";
    switch (type) {
      case AircraftConfigType.None:
        typeString = "None";
        break;
      case AircraftConfigType.P2C:
        typeString = "P2C";
        break;
      case AircraftConfigType.Freighter:
        typeString = "Freighter";
        break;
      default:
        break;
    }
    return typeString;
  }


  public static GetAircraftStaus(type: AircraftStatus): string {
    let statusString = "None";
    switch (type) {
      case AircraftStatus.None:
        statusString = "None";
        break;
      case AircraftStatus.Charter:
        statusString = "Charter";
        break;
      case AircraftStatus.Schedule:
        statusString = "Schedule";
        break;
      case AircraftStatus.Maintenance:
        statusString = "Maintenance";
        break;
      default:
        break;
    }
    return statusString;
  }


  public static GetAircraftActiveStaus(type: AircraftActiveTypes): string {
    let statusString = "None";
    switch (type) {
      case AircraftActiveTypes.None:
        statusString = "All";
        break;
      case AircraftActiveTypes.Active:
        statusString = "Active";
        break;
      case AircraftActiveTypes.Inactive:
        statusString = "Inactive";
        break;
      default:
        break;
    }
    return statusString;
  }

  public static GetWeightType(type: WeightType): string {
    let statusString = "None";
    switch (type) {
      case WeightType.None:
        statusString = "None";
        break;
      case WeightType.M:
        statusString = "M";
        break;
      case WeightType.Minus45K:
        statusString = "-45K";
        break;
      case WeightType.Plus45K:
        statusString = "+45K";
        break;
      case WeightType.Plus100K:
        statusString = "+100K";
        break;
      case WeightType.Plus300K:
        statusString = "+300K";
        break;
      case WeightType.Plus500K:
        statusString = "+500K";
        break;
      case WeightType.Plus1000K:
        statusString = "+1000K";
        break;
      default:
        break;
    }
    return statusString;
  }

  public static GetBookingStatus(bookingStatus: BookingStatus): string {
    let statusString = "None";
    switch (bookingStatus) {
      case BookingStatus.None:
        statusString = "None";
        break;
      case BookingStatus.Pending:
        statusString = "Booked";
        break;
      case BookingStatus.Accepted:
        statusString = "Received";
        break;
      case BookingStatus.Dispatched:
        statusString = "Dispatched";
        break;
      case BookingStatus.Exported:
        statusString = "Exported";
        break;
      case BookingStatus.Invoiced:
        statusString = "Invoiced";
        break;
      case BookingStatus.Loading:
        statusString = "Loading";
        break;
      default:
        break;
    }
    return statusString;
  }

  public static GetAWBStaus(type: AWBNumberStatus): string {
    let statusString = "None";
    switch (type) {
      case AWBNumberStatus.All:
        statusString = "All";
        break;
      case AWBNumberStatus.Available:
        statusString = "Available";
        break;
      case AWBNumberStatus.Used:
        statusString = "Used";
        break;
      default:
        break;
    }
    return statusString;
  }

  public static GetCargoAgentStaus(type: CargoAgentStatus): string {
    let statusString = "None";
    switch (type) {
      case CargoAgentStatus.None:
        statusString = "None";
        break;
      case CargoAgentStatus.Pending:
        statusString = "Pending";
        break;
      case CargoAgentStatus.Active:
        statusString = "Active";
        break;
      case CargoAgentStatus.Suspended:
        statusString = "Suspended";
        break;
      default:
        break;
    }
    return statusString;
  }

  public static GetScheduleStaus(type: ScheduleStatus): string {
    let statusString = "None";
    switch (type) {
      case ScheduleStatus.None:
        statusString = "None";
        break;
      case ScheduleStatus.Chartered:
        statusString = "Chartered";
        break;
      case ScheduleStatus.Maintainance:
        statusString = "Maintainance";
        break;
      case ScheduleStatus.Schedule:
        statusString = "Schedule";
        break;
      default:
        break;
    }
    return statusString;
  }

  public static GetLinkAircraftStatus(val: LinkAircraftFliterStatus) {
    let text = "None";
    switch(val){
      case LinkAircraftFliterStatus.None:
        text="All";
        break;
      case LinkAircraftFliterStatus.Pending:
        text="Pending";
        break;
      case  LinkAircraftFliterStatus.PartiallyCompleted:
        text="Partially Completed";
        break;
      case  LinkAircraftFliterStatus.Completed:
        text="Completed";
        break;
      default:
        break;
    }
    return text;
  }

  public static GetReportType(type: MasterSheduleReportType): string {
    let statusString = "None";
    switch (type) {
      case MasterSheduleReportType.None:
        statusString = "All";
        break;
      case MasterSheduleReportType.IdleTimeReport:
        statusString = "Idle Time";
        break
      case MasterSheduleReportType.Running:
        statusString = "Schedule Time";
        break
      default:
        break;
    }
    return statusString;
  }

  public static GetRateType(type:RateType):string{
    let statusString = "None";
    switch (type) {
      case RateType.SpotRate:
        statusString = "Spot Rate";
        break;
      case RateType.ContractRate:
        statusString = "Contract Rate";
        break
      case RateType.PromotionalRate:
        statusString = "Promotional Rate";
        break
      case RateType.MarketPublishRate:
        statusString = "Market Publish Rate";
        break
      default:
        break;
    }
    return statusString;
  }

  public static GetCargoType(type:CargoType):string{
    let statusString = "None";
    switch (type) {
      case CargoType.General:
        statusString = "General";
        break;
      case CargoType.DGR:
        statusString = "DGR";
        break;
      default:
        break;
    }
    return statusString;
  }

  public static IsMinimumDateTimeValue(eta: Date): Boolean {
      return new Date(eta).getTime() === new Date('1/1/0001 12:00:00 AM').getTime();
  }

  public static GetULDType(type:ULDType):string{
    let statusString = "None";
    switch (type) {
      case ULDType.Container:
        statusString = "Container";
        break;
      case ULDType.Pallet:
        statusString = "Pallet";
        break
      default:
        break;
    }
    return statusString;
  }

  public static GetULDOwnershipType(type:ULDOwnershipType):string{
    let statusString = "None";
    switch (type) {
      case ULDOwnershipType.OwnByAirline:
        statusString = "Own by airline";
        break;
      case ULDOwnershipType.Other:
        statusString = "Other";
        break
      default:
        break;
    }
    return statusString;
  }

  public static GetULDLocateStatus(type:ULDLocateStatus):string{
    let statusString = "None";
    switch (type) {
      case ULDLocateStatus.Lend:
        statusString = "Lend";
        break;
      case ULDLocateStatus.Maintenance:
        statusString = "Maintenance";
        break
      case ULDLocateStatus.OnBoard:
        statusString = "On-Board";
        break
      case ULDLocateStatus.OnGround:
        statusString = "On-Ground";
        break
      default:
        break;
    }
    return statusString;
  }

  public static GetDimentions(length:number,width:number,height:number):string{
    return (length == null ? 0 : length)+" x "+(width == null ? 0 : width)+" x "+(height == null ? 0 : height);
  }



}
