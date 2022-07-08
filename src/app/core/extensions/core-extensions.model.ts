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

  public static PadLeadingZeros(num:number, size:number) {
    var s = num+"";
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
        typeString = "B787-9";
        break;
      case AircraftTypes.A320200:
        typeString = "A320-200";
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
      case AircraftConfigType.Passenger:
        typeString = "Passenger";
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
}



