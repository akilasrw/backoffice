import { AgentRateManagement } from './../../../_models/view-models/rate/agent-rate-management';
import { Component, OnInit } from '@angular/core';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { AgentRateFilterQuery } from 'src/app/_models/queries/rate/agent-rate-filter-query.model';
import { AirportService } from 'src/app/_services/airport.service';
import { CargoAgentService } from 'src/app/_services/cargo-agent.service';
import { RateService } from 'src/app/_services/rate.service';
import { ToastrService } from 'ngx-toastr';
import { CommonMessages } from 'src/app/core/constants/common-messages';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';

@Component({
  selector: 'app-rate-list',
  templateUrl: './rate-list.component.html',
  styleUrls: ['./rate-list.component.scss']
})
export class RateListComponent implements OnInit {

  addRatemodalVisible = false;
  addRateModalVisibleAnimate = false;
  modalVisibleAnimateDelete = false;
  modalVisibleDelete = false;
  rateDetailModalVisible = false;
  rateDetailModalVisibleAnimate = false;
  rateUpdateModalVisible = false;
  rateUpdateModalVisibleAnimate = false;
  cargoAgents: SelectList[] = [];
  originAirpots: SelectList[] = [];
  destinationAirpots: SelectList[] = [];
  rates: AgentRateManagement[] = [];
  agentRateFilterQuery: AgentRateFilterQuery = new AgentRateFilterQuery();
  totalCount: number = 0;
  keyword = 'value';
  cargoAgentId?: string;
  originAirportId?: string;
  destinationAirportId?: string;
  isLoading: boolean = false;
  selectedRateId?: string;
  selectedDeletedID?: string;

  constructor(
    private cargoAgentService: CargoAgentService,
    private airportService: AirportService,
    private rateService: RateService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadCargoAgents();
    this.loadAirports();
    this.getRateList();
  }

  getRateList() {
    this.isLoading = true;
    this.agentRateFilterQuery.cargoAgentId = this.cargoAgentId;
    this.agentRateFilterQuery.originAirportId = this.originAirportId;
    this.agentRateFilterQuery.destinationAirportId = this.destinationAirportId;
    this.rateService.getFilteredList(this.agentRateFilterQuery).subscribe(
      {
        next: (res) => {
          this.rates = res.data;
          this.totalCount = res.count;
          this.isLoading = false;
        },
        error: (error) => {
          this.totalCount = 0;
          this.rates = [];
          this.isLoading = false;
        }
      }
    );
  }

  loadAirports() {
    this.isLoading = true;
    this.airportService.getSelectList()
      .subscribe(res => {
        if (res.length > 0) {
          this.originAirpots = res;
          Object.assign(this.destinationAirpots, res);
        }
        this.isLoading = false;
      });
  }

  loadCargoAgents() {
    this.isLoading = true;
    this.cargoAgentService.getAgentList()
      .subscribe({
        next: (res) => {
          if (res.length > 0) {
            this.cargoAgents = res;
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
        }
      }
      );
  }

  selectedCargoAgent(value: any) {
    this.cargoAgentId = value.id;
  }

  onClearCargoAgent() {
    this.cargoAgentId = undefined;
  }

  selectedOrigin(value: any) {
    this.originAirportId = value.id;
  }

  onClearOrigin() {
    this.originAirportId = undefined;
  }

  selectedDestination(value: any) {
    this.destinationAirportId = value.id;
  }

  onClearDestination() {
    this.destinationAirportId = undefined;
  }

  openAddRate() {
    this.addRatemodalVisible = true;
    setTimeout(() => (this.addRateModalVisibleAnimate = true));
  }

  closeAddRate() {
    this.addRateModalVisibleAnimate = false;
    setTimeout(() => (this.addRatemodalVisible = false), 300);
  }

  openRateDetail(rateId: string) {
    this.selectedRateId = rateId;
    this.rateDetailModalVisible = true;
    setTimeout(() => (this.rateDetailModalVisibleAnimate = true));
  }

  closeRateDetail() {
    this.rateDetailModalVisibleAnimate = false;
    setTimeout(() => (this.rateDetailModalVisible = false), 300);
  }

  onUpdate(rateId: string) {
    this.selectedRateId = rateId;
    this.rateUpdateModalVisible = true;
    setTimeout(() => (this.rateUpdateModalVisibleAnimate = true));
  }

  closeRateUpdate() {
    this.rateUpdateModalVisibleAnimate = false;
    setTimeout(() => (this.rateUpdateModalVisible = false), 300);
  }

  public onPageChanged(event: any) {
    if (this.agentRateFilterQuery?.pageIndex !== event) {
      this.agentRateFilterQuery.pageIndex = event;
      this.getRateList();
    }
  }

  onRateAdd() {
    this.getRateList();
  }

  onRateUpdate() {
    this.getRateList();
  }

  deleteRate() {
    if (this.selectedDeletedID) {
      this.isLoading = true;
      this.rateService.deleteRate(this.selectedDeletedID)
        .subscribe({
          next: (res) => {
            this.toastr.success(CommonMessages.DeletedSuccessMsg);
            this.cancelDelete();
            this.rates = [];
            this.isLoading = false;
            this.getRateList();
          },
          error: (error) => {
            this.toastr.error(CommonMessages.DeleteFailMsg);
            this.cancelDelete();
            this.isLoading = false;
          }
        });
    }
  }

  onDelete(airportId: string) {
    this.selectedDeletedID = airportId;
    this.modalVisibleDelete = true;
    setTimeout(() => (this.modalVisibleAnimateDelete = true));
  }

  cancelDelete() {
    this.selectedDeletedID = '';
    this.modalVisibleAnimateDelete = false;
    setTimeout(() => (this.modalVisibleDelete = false), 300);
  }

  GetRateType(type:number){
    return CoreExtensions.GetRateType(type);
  }

  GetCargoType(type:number){
    return CoreExtensions.GetCargoType(type);
  }
  
}
