import { Component, OnInit } from '@angular/core';
import { TRUCK } from './../../../_models/view-models/truck-master/truck.model';
import { TruckService } from 'src/app/_services/truck.service';

@Component({
  selector: 'app-truck-master-list',
  templateUrl: './truck-master-list.component.html',
  styleUrls: ['./truck-master-list.component.scss']
})
export class TruckMasterListComponent implements OnInit {
  trucks: TRUCK[] = [];
  modalVisible = false;
  modalVisibleAnimate = false;
  selectedTruck?: TRUCK;
  isLoading:boolean=false;
  totalCount: number = 0;

  constructor(private truckService: TruckService) { }

  ngOnInit(): void {
    this.getFilteredList();
  }

  getFilteredList(){
    this.isLoading=true;

    this.truckService.getFilteredList().subscribe(
      {
        next: (res) => {
          this.trucks = res.data;
          this.totalCount = res.count
          console.log("Trcuk Info", this.trucks, "count",this.totalCount );
          this.isLoading=false;
        },
        error: (error) => {
          this.trucks = [];
          this.isLoading=false;
        }
      }
    )

  }

  onEdit(truck: TRUCK) {
    this.selectedTruck = truck;
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
    console.log("truck", this.selectedTruck);
  }

  closeEditTruck() {
    this.selectedTruck = undefined;
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }
}
