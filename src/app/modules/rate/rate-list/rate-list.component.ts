import { AgentRateManagement } from './../../../_models/view-models/rate/agent-rate-management';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { AgentRateFilterQuery } from 'src/app/_models/queries/rate/agent-rate-filter-query.model';
import { AirportService } from 'src/app/_services/airport.service';
import { CargoAgentService } from 'src/app/_services/cargo-agent.service';
import { RateService } from 'src/app/_services/rate.service';
import { ToastrService } from 'ngx-toastr';
import { CommonMessages } from 'src/app/core/constants/common-messages';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { RateType } from 'src/app/core/enums/common-enums';
import { Router } from '@angular/router';
import { AgentRateManagementRM } from 'src/app/_models/request-models/rate/agent-rate-management-rm';
import { AutoCompleteDropdownComponent } from 'src/app/shared/components/forms/auto-complete-dropdown/auto-complete-dropdown.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  isLoading: boolean = false;
  selectedRateId?: string;
  selectedDeletedID?: string;
  isFiltered: boolean = false;

  @ViewChild('cargoAgentAutoComplete') cargoAgentAutoComplete!: AutoCompleteDropdownComponent;
  @ViewChild('originAirportAutoComplete') originAirportDropdown!: AutoCompleteDropdownComponent;
  @ViewChild('destinationAirportAutoComplete') destinationAirportDropdown!: AutoCompleteDropdownComponent;

  constructor(
    private cargoAgentService: CargoAgentService,
    private airportService: AirportService,
    private rateService: RateService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCargoAgents();
    this.loadAirports();
    this.getFilteredList();
  }

  getFilteredList() {
    this.isLoading = true;
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
    this.agentRateFilterQuery.cargoAgentId = value.id;
    this.onChangeFilter();
  }

  onClearCargoAgent() {
    this.agentRateFilterQuery.cargoAgentId = undefined;
  }

  selectedOrigin(value: any) {
    this.agentRateFilterQuery.originAirportId = value.id;
    this.onChangeFilter();
  }

  onClearOrigin() {
    this.agentRateFilterQuery.originAirportId = undefined;
  }

  selectedDestination(value: any) {
    this.agentRateFilterQuery.destinationAirportId = value.id;
    this.onChangeFilter();
  }

  onClearDestination() {
    this.agentRateFilterQuery.destinationAirportId = undefined;
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
      this.getFilteredList();
    }
  }

  onRateAdd() {
    this.getFilteredList();
  }

  onRateUpdate() {
    this.getFilteredList();
  }



  clearFilter() {
    this.agentRateFilterQuery = new AgentRateFilterQuery();
    this.getFilteredList();
    this.originAirportDropdown.clear();
    this.destinationAirportDropdown.clear();
    this.cargoAgentAutoComplete.clear();
    this.isFiltered = false;
  }

  onChangeFilter() {
    this.isFiltered= true;
    if((this.agentRateFilterQuery.cargoAgentId == undefined || this.agentRateFilterQuery.cargoAgentId == '') &&
    (this.agentRateFilterQuery.originAirportId == undefined || this.agentRateFilterQuery.originAirportId == '') &&
    (this.agentRateFilterQuery.destinationAirportId == undefined || this.agentRateFilterQuery.destinationAirportId == '')) {
      this.isFiltered = false;
    }
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
            this.getFilteredList();
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

  get rateType(): typeof RateType {
    return RateType;
  }

  onChecked(rateItem :AgentRateManagement){
    let updateRate = new AgentRateManagementRM()
    updateRate.id =rateItem.id;
    updateRate.isActive=!rateItem.isActive;
    this.rateService.updateActiveStatus(updateRate).subscribe({
      next: (res) => {
        this.getFilteredList();
      },
      error: (err) => {
      }
    })
  }

}
