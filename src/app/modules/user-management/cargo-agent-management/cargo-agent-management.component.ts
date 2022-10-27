import { CargoAgent } from './../../../_models/view-models/cargo-agent/CargoAgent';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CargoAgentFilterQuery } from 'src/app/_models/queries/cargo-agent/cargo-agent-filter-query';
import { CargoAgentService } from 'src/app/_services/cargo-agent.service';
import { CargoAgentStatus } from 'src/app/core/enums/common-enums';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';

@Component({
  selector: 'app-cargo-agent-management',
  templateUrl: './cargo-agent-management.component.html',
  styleUrls: ['./cargo-agent-management.component.scss']
})
export class CargoAgentManagementComponent implements OnInit {

  isLoading: boolean=false;
  filterFormHasValue:boolean=false;
  cargoAgentName?:string;
  cargoAgentFilterQuery: CargoAgentFilterQuery = new CargoAgentFilterQuery();
  cargoAgentStatus?: CargoAgentStatus=CargoAgentStatus.None;
  agentStatus: SelectList[] = [];
  cargoAgents: CargoAgent[]=[];
  totalCount: number = 0;
  keyword = 'value';

  constructor(private cargoAgentService: CargoAgentService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getCargoAgentList();
    this.loadStatusTypes();
  }

  loadStatusTypes() {
    this.agentStatus.push({ id: CargoAgentStatus.None.toString(), value: CoreExtensions.GetCargoAgentStaus(CargoAgentStatus.None) },
      { id: CargoAgentStatus.Pending.toString(), value: CoreExtensions.GetCargoAgentStaus(CargoAgentStatus.Pending) },
      { id: CargoAgentStatus.Active.toString(), value: CoreExtensions.GetCargoAgentStaus(CargoAgentStatus.Active) },
      { id: CargoAgentStatus.Suspended.toString(), value: CoreExtensions.GetCargoAgentStaus(CargoAgentStatus.Suspended) });
  }


  getCargoAgentList() {
    this.isLoading=true;
    this.cargoAgentFilterQuery.cargoAgentName = this.cargoAgentName;
    this.cargoAgentFilterQuery.isCountryInclude = true;
    this.cargoAgentFilterQuery.isAirportInclude = true;
    this.cargoAgentFilterQuery.status = this.cargoAgentStatus;
    this.cargoAgentService.getFilteredList(this.cargoAgentFilterQuery).subscribe(
      {
        next: (res) => {
          this.cargoAgents = res.data
          this.totalCount = res.count
          this.isLoading=false;
        },
        error: (error) => {
          this.totalCount = 0;
          this.cargoAgents = [];
          this.isLoading=false;
        }
      }
    )
  }

  selectedStatus(value: any) {
    this.cargoAgentStatus = Number(value.id);
  }

  onClearStatus() {
    this.cargoAgentStatus = CargoAgentStatus.None;;
  }

  onChangeFilterFrm(event: any) {
    if (this.cargoAgentName !== undefined && this.cargoAgentName !== "") {
      this.filterFormHasValue = true;
    } else {
      this.filterFormHasValue = false;
    }
  }

  clearFilter() {
    this.cargoAgentName = undefined;
    this.filterFormHasValue = false;
  }

  public onPageChanged(event: any) {
    if (this.cargoAgentFilterQuery?.pageIndex !== event) {
      this.cargoAgentFilterQuery.pageIndex = event;
      this.getCargoAgentList();
    }
  }

}
