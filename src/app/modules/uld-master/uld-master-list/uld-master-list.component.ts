import { Component, OnInit } from '@angular/core';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { ULDFilterQuery } from 'src/app/_models/queries/uld/uld-filter-query.model';
import { ULD } from 'src/app/_models/view-models/uld-master/ulsd.model';
import { ULDService } from 'src/app/_services/uld.service';

@Component({
  selector: 'app-uld-master-list',
  templateUrl: './uld-master-list.component.html',
  styleUrls: ['./uld-master-list.component.scss']
})
export class UldMasterListComponent implements OnInit {
  ulds: ULD[] = [];
  uldFilterQuery: ULDFilterQuery = new ULDFilterQuery();
  isLoading:boolean=false;
  filterFormHasValue:boolean=false;
  uldNumber?: string;
  totalCount: number = 0;
  modalVisible = false;
  modalVisibleAnimate = false;


  constructor(private uldService:ULDService) { }

  ngOnInit(): void {
    this.getFilteredList();
  }


  getFilteredList(){
    this.isLoading=true;
    this.uldFilterQuery.uLDNumber = this.uldNumber;
  
    this.uldService.getFilteredList(this.uldFilterQuery).subscribe(
      {
        next: (res) => {
          this.ulds = res.data
          this.totalCount = res.count
          this.isLoading=false;
        },
        error: (error) => {
          this.totalCount = 0;
          this.ulds = [];
          this.isLoading=false;
        }
      }
    )

  }

  onChangeFilterFrm(event: any) {
    if (this.uldNumber !== undefined && this.uldNumber !== "")
    {
      this.filterFormHasValue = true;
    } else {
      this.filterFormHasValue = false;
    }
  }

  clearFilter(){
    this.uldNumber=undefined;
  }

  addULD() {
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  closeAddULD() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  onPageChanged(event: any) {
    if (this.uldFilterQuery?.pageIndex !== event) {
      this.uldFilterQuery.pageIndex = event;
      this.getFilteredList();
    }
  }

  onULDAdd(){
    this.getFilteredList();
  }

  GetULDType(type: number) {
    return CoreExtensions.GetULDType(type);
  }

  GetULDOwnershipType(type: number) {
    return CoreExtensions.GetULDOwnershipType(type);
  }

  GetDimentions(item: any) {
    return CoreExtensions.GetDimentions(item.length, item.width, item.height);
  }
  
  GetULDLocateStatus(type: number) {
    return CoreExtensions.GetULDLocateStatus(type);
  }
  

}
