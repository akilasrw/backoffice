import { HttpParams } from "@angular/common/http";
import { BasePaginationQuery } from "src/app/shared/models/base-pagination-query.model";

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
}



