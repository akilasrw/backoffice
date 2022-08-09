import { PalletDetail } from './../../../_models/view-models/pallet-management/pallet-detail.model';
import { PalletPositionSearchQuery } from './../../../_models/queries/pallet-management/pallet-position-search-query.model';
import { Component, OnInit } from '@angular/core';
import { PalletManagementService } from 'src/app/_services/pallet-management.service';

@Component({
  selector: 'app-pallet-management',
  templateUrl: './pallet-management.component.html',
  styleUrls: ['./pallet-management.component.scss']
})
export class PalletManagementComponent implements OnInit {

  isLoading:boolean=false;
  filterFormHasValue:boolean=false;
  palletPositions:PalletDetail[]=[];
  palletPositionSearchQuery: PalletPositionSearchQuery = new PalletPositionSearchQuery();
  flightNumber?: string;
  flightDate?: Date;
  modalVisible = false;
  modalVisibleAnimate = false;

  constructor(private palletManagementService:PalletManagementService) { }

  ngOnInit(): void {
  }

  getFilteredList(){
    this.isLoading=true;
    this.palletPositionSearchQuery.flightNumber=this.flightNumber;
    this.palletPositionSearchQuery.flightDate=this.flightDate;

    this.palletManagementService.getFilteredList(this.palletPositionSearchQuery).subscribe(
      {
        next:(res)=>{
          this.palletPositions = res;
          this.isLoading=false;
        },
        error:()=>{
          this.palletPositions = [];
          this.isLoading=false;
        }
      }
    )
  }

  onChangeFilterFrm(event: any) {
    if ((this.flightNumber !== undefined && this.flightNumber !== "") || (this.flightDate !== null))
    {
      this.filterFormHasValue = true;
    } else {
      this.filterFormHasValue = false;
    }
  }

  clearFilter(){
    this.flightNumber=undefined;
    this.flightDate=undefined;
    this.filterFormHasValue = false;
  }

  addPallet(pallet: PalletDetail) {
    if(!pallet.isPalletAssigned){
      this.modalVisible = true;
      setTimeout(() => (this.modalVisibleAnimate = true)); 
    }
  }

  closeAddPallet(){
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

}
