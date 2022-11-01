import { PalletDetail } from './../../../_models/view-models/pallet-management/pallet-detail.model';
import { PalletPositionSearchQuery } from './../../../_models/queries/pallet-management/pallet-position-search-query.model';
import { Component, OnInit } from '@angular/core';
import { PalletManagementService } from 'src/app/_services/pallet-management.service';
import { ToastrService } from 'ngx-toastr';

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
  aircraftNumber?:string;
  flightDate?: Date;
  modalVisible = false;
  modalVisibleAnimate = false;
  selectedPosition? :PalletDetail;
  constructor(private palletManagementService:PalletManagementService,
    private toastr:ToastrService) { }

  ngOnInit(): void {
  }

  getFilteredList(){
    if(this.flightNumber === undefined || this.flightNumber === "" &&
    this.aircraftNumber === undefined || this.aircraftNumber === "" &&
    this.flightDate === undefined){
      this.toastr.error('Please enter flight number, aircraft number and flight date.');
      return;
    }
    if(this.flightNumber === undefined || this.flightNumber === ""){
      this.toastr.error('Please enter flight number.');
      return;
    }
    if(this.aircraftNumber === undefined || this.aircraftNumber === ""){
      this.toastr.error('Please enter aircraft number.');
      return;
    }
    if(this.flightDate === undefined){
      this.toastr.error('Please select flight date.');
      return;
    }

    this.isLoading=true;
    this.palletPositionSearchQuery.flightNumber=this.flightNumber;
    this.palletPositionSearchQuery.flightDate=this.flightDate;
    this.palletPositionSearchQuery.aircraftNumber=this.aircraftNumber;

    this.palletManagementService.getFilteredList(this.palletPositionSearchQuery).subscribe(
      {
        next:(res)=>{
          this.palletPositions = res;
          if(this.palletPositions.length==0){
            this.toastr.warning('No record found.');
          }
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
    if(!pallet.isPalletAssigned) {
      pallet.sequence = pallet.position;
      this.selectedPosition=pallet;
      this.modalVisible = true;
      setTimeout(() => (this.modalVisibleAnimate = true));
    }
  }

  onPallettAdd(){
    this.getFilteredList();
  }

  closeAddPallet(){
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

}
