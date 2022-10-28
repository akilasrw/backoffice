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
  modalVisibleAnimateAcceptAgent:boolean=false;
  modalVisibleAcceptAgent:boolean=false;
  selectedAgent?:CargoAgent =new CargoAgent();
  modalVisibleAnimateSuspendAgent:boolean=false;
  modalVisibleSuspendAgent:boolean=false;


  constructor(private cargoAgentService: CargoAgentService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getCargoAgentList();
    this.loadStatusTypes();
  }

  loadStatusTypes() {
    this.agentStatus.push({ id: CargoAgentStatus.None.toString(), value: "All" },
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

  GetCargoAgentStaus(type: number) {
    return CoreExtensions.GetCargoAgentStaus(type);
  }

  get CagentStatus(): typeof CargoAgentStatus {
    return CargoAgentStatus;
  }

  clearFilter() {
    this.cargoAgentName = undefined;
    this.filterFormHasValue = false;
  }

  onActive(id:string){
    var agent = new CargoAgent();
    agent.id=id;
    agent.status=CargoAgentStatus.Active;
    this.selectedAgent = agent;
    this.modalVisibleAcceptAgent = true;
    setTimeout(() => (this.modalVisibleAnimateAcceptAgent = true));
  }

  onSuspend(id:string){
    var agent = new CargoAgent();
    agent.id=id;
    agent.status=CargoAgentStatus.Suspended;
    this.selectedAgent = agent;
    this.modalVisibleSuspendAgent = true;
    setTimeout(() => (this.modalVisibleAnimateSuspendAgent = true));
  }

  cancelActive() {
    this.selectedAgent = undefined;
    this.modalVisibleAnimateAcceptAgent = false;
    setTimeout(() => (this.modalVisibleAcceptAgent = false), 300);
  }

  cancelSuspend() {
    this.selectedAgent = undefined;
    this.modalVisibleAnimateSuspendAgent = false;
    setTimeout(() => (this.modalVisibleSuspendAgent = false), 300);
  }

  onAction(){
    if (this.selectedAgent != undefined) {
      this.isLoading=true;
      this.cargoAgentService.statusUpdate({id:this.selectedAgent.id,status:this.selectedAgent.status})
        .subscribe({
          next: (res) => {
            this.toastr.success((this.selectedAgent!.status == CargoAgentStatus.Active)?"Cargo agent successfully active.":"Cargo agent successfully suspend.");
            (this.selectedAgent!.status == CargoAgentStatus.Active)? this.cancelActive() : this.cancelSuspend();
            this.cargoAgents = [];
            this.isLoading=false;
            this.getCargoAgentList();
          },
          error: (error) => {
            this.toastr.error((this.selectedAgent!.status == CargoAgentStatus.Active)?"Cargo agent unable to active.":"Cargo agent unable to suspend.");
            (this.selectedAgent!.status == CargoAgentStatus.Active)? this.cancelActive() : this.cancelSuspend();
            this.isLoading=false;
          }
        });
    }
  }

  public onPageChanged(event: any) {
    if (this.cargoAgentFilterQuery?.pageIndex !== event) {
      this.cargoAgentFilterQuery.pageIndex = event;
      this.getCargoAgentList();
    }
  }

}
