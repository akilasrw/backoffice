import { HttpParams } from "@angular/common/http";
import { BasePaginationQuery } from "src/app/shared/models/base-pagination-query.model";
import { AircraftTypes, SectorType } from "../enums/common-enums";

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
}



