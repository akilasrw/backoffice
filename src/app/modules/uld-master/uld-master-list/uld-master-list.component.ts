import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-uld-master-list',
  templateUrl: './uld-master-list.component.html',
  styleUrls: ['./uld-master-list.component.scss']
})
export class UldMasterListComponent implements OnInit {

  isLoading:boolean=false;
  filterFormHasValue:boolean=false;
  uldNumber?: string;
  totalCount: number = 0;
  modalVisible = false;
  modalVisibleAnimate = false;


  constructor() { }

  ngOnInit(): void {
  }


  getFilteredList(){

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

}
