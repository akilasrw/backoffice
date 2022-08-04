import { AWBStackFilterQuery } from './../../../_models/queries/awb/awb-stack-filter-query.model';
import { AWBStckRequest } from './../../../_models/request-models/awb/awb-stack-request.model';
import { CargoAgentService } from './../../../_services/cargo-agent.service';
import { AwbService } from './../../../_services/awb.service';
import { AWBStack } from './../../../_models/view-models/awb/awb-stack.model';
import { Component, OnInit } from '@angular/core';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { ToastrService } from 'ngx-toastr';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';

@Component({
  selector: 'app-awb-stack-management',
  templateUrl: './awb-stack-management.component.html',
  styleUrls: ['./awb-stack-management.component.scss']
})
export class AwbStackManagementComponent implements OnInit {

  keyword = 'value';
  cargoAgents: SelectList[] = [];
  lastAWBStackNumber?: number;
  startSequenceNumber?: number;
  endSequenceNumber?: number;
  cargoAgentId?: string;
  cargoAgentName?: string;
  awbStackRequest: AWBStckRequest = new AWBStckRequest();
  awbStackFilterQuery: AWBStackFilterQuery = new AWBStackFilterQuery();
  awbStackList: AWBStack[] = []
  totalCount: number = 0;
  filterFormHasValue = false;
  isLoading :boolean= false;

  constructor(
    private awbSerice: AwbService,
    private toastr: ToastrService,
    private cargoAgentService: CargoAgentService
  ) { }

  ngOnInit(): void {
    this.loadCargoAgents();
    this.getLastAWBStack();
    this.getAWBStackList();
  }

  loadCargoAgents() {
    this.isLoading=true;
    this.cargoAgentService.getAgentList()
      .subscribe({
        next: (res) => {
          if (res.length > 0) {
            this.cargoAgents = res;
          }
          this.isLoading=false;
        },
        error: (error) => {
          this.isLoading=false;
        }
      }
      );
  }

  getLastAWBStack() {
    this.isLoading=true;
    this.awbSerice.getLastStackItem()
      .subscribe(
        {
          next: (res) => {
            this.lastAWBStackNumber = res.endSequenceNumber + 1;
            this.startSequenceNumber = this.lastAWBStackNumber;
            this.isLoading=false;
          },
          error: (error) => {
            this.isLoading=false;
          }
        }
      );
  }

  getAWBStackList() {
    this.isLoading=true;
    this.awbStackFilterQuery.cargoAgentName = this.cargoAgentName;
    this.awbStackFilterQuery.isAgentInclude = true;
    this.awbSerice.getFilteredAWBStackList(this.awbStackFilterQuery).subscribe(
      {
        next: (res) => {
          this.awbStackList = res.data
          this.totalCount = res.count
          this.isLoading=false;
        },
        error: (error) => {
          this.totalCount = 0;
          this.awbStackList = [];
          this.isLoading=false;
        }
      }
    )
  }

  selectedCargoAgent(value: any) {
    this.cargoAgentId = value.id;
  }

  addAWBStack() {
    if (this.isValid()) {
      this.isLoading=true;
      this.awbStackRequest.cargoAgentId = this.cargoAgentId;
      this.awbStackRequest.startSequenceNumber = this.startSequenceNumber;
      this.awbStackRequest.endSequenceNumber = this.endSequenceNumber;
      this.awbSerice.create(this.awbStackRequest).subscribe({
        next: (res) => {
          this.isLoading=false;
          this.toastr.success('AWB number stack added successfully.');
          this.getLastAWBStack();
          this.endSequenceNumber = undefined;
          this.getAWBStackList();
        },
        error: (error) => {
          this.isLoading=false;
          this.toastr.error('Unable to add AWB number stack.');
        }
      });
    }
  }

  isValid(): boolean {
    if (this.cargoAgentId === undefined || this.cargoAgentId === null) {
      this.toastr.warning('Please select cargo agent.');
      return false;
    }

    if (this.startSequenceNumber === undefined || this.startSequenceNumber === null) {
      this.toastr.warning('Please enter starting sequence number.');
      return false;
    }

    if (this.endSequenceNumber === undefined || this.endSequenceNumber === null) {
      this.toastr.warning('Please enter ending sequence number.');
      return false;
    }

    if (this.lastAWBStackNumber != null && this.startSequenceNumber != null && this.startSequenceNumber < this.lastAWBStackNumber) {
      this.toastr.warning('Starting sequence number should be ' + this.lastAWBStackNumber + '.');
      return false;
    }

    if (this.endSequenceNumber != null && this.startSequenceNumber != null && this.endSequenceNumber <= this.startSequenceNumber) {
      this.toastr.warning('Ending sequence number should be greater than starting sequence number.');
      return false;
    }
    return true;
  }

  onChangeFilterFrm(event: any) {
    if (this.cargoAgentName !== undefined && this.cargoAgentName !== "") {
    this.filterFormHasValue = true;
  } else {
    this.filterFormHasValue = false;
  }

  }

  clearFilter() {
    this.cargoAgentName=undefined;
    this.filterFormHasValue = false;
  }

  public onPageChanged(event: any) {
    if (this.awbStackFilterQuery?.pageIndex !== event) {
      this.awbStackFilterQuery.pageIndex = event;
      this.getAWBStackList();
    }
  }

  GetFormattedAWBNumber(value: number): string {
    return value == 0?'-':CoreExtensions.PadLeadingZeros(value,8);
  }
}
