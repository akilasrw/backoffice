import { AWBStackFilterQuery } from './../../../_models/queries/awb/awb-stack-filter-query.model';
import { AWBStckRequest } from './../../../_models/request-models/awb/awb-stack-request.model';
import { CargoAgentService } from './../../../_services/cargo-agent.service';
import { AwbService } from './../../../_services/awb.service';
import { AWBStack } from './../../../_models/view-models/awb/awb-stack.model';
import { Component, OnInit } from '@angular/core';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { ToastrService } from 'ngx-toastr';

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
  endSequenceNumber?: number ;
  cargoAgentId?: string;
  awbStackRequest: AWBStckRequest = new AWBStckRequest();
  awbStackFilterQuery: AWBStackFilterQuery = new AWBStackFilterQuery();
  awbStackList: AWBStack[] = []
  totalCount: number = 0;

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
    this.cargoAgentService.getAgentList()
      .subscribe({
        next: (res) => {
          if (res.length > 0) {
            this.cargoAgents = res;
          }
        },
        error: (error) => {

        }
      }
      );
  }

  getLastAWBStack() {
    this.awbSerice.getLastStackItem()
      .subscribe(
        {
          next: (res) => {
            this.lastAWBStackNumber = res.endSequenceNumber + 1;
            this.startSequenceNumber = this.lastAWBStackNumber;
          },
          error: (error) => {

          }
        }
      );
  }

  getAWBStackList() {
     this.awbStackFilterQuery.isAgentInclude = false;
      this.awbSerice.getFilteredAWBStackList(this.awbStackFilterQuery).subscribe(
        {
          next: (res) => {
            this.awbStackList = res.data
            this.totalCount = res.count
          },
          error: (error) => {
            this.totalCount = 0;
            this.awbStackList = []
          }
        }
      )
  }

  selectedCargoAgent(value: any) {
    this.cargoAgentId = value.id;
  }

  addAWBStack() {
    debugger
    if (this.isValid()) {
      this.awbStackRequest.cargoAgentId = this.cargoAgentId;
      this.awbStackRequest.startSequenceNumber = this.startSequenceNumber;
      this.awbStackRequest.endSequenceNumber = this.endSequenceNumber;
      this.awbSerice.create(this.awbStackRequest).subscribe({
        next: (res) => {
          this.toastr.success('AWB number stack added successfully.');
          this.getLastAWBStack();
          this.endSequenceNumber=undefined;
          this.getAWBStackList();
        },
        error: (error) => {
          this.toastr.error('Unable to add AWB number stack.');
        }
      });
    }
  }

  isValid(): boolean {
    if(this.cargoAgentId === undefined || this.cargoAgentId === null){
      this.toastr.warning('Please select cargo agent.');
      return false;
    }
    
    if(this.startSequenceNumber === undefined || this.startSequenceNumber === null) {
      this.toastr.warning('Please enter starting sequence number.');
      return false;
    }

    if(this.endSequenceNumber === undefined || this.endSequenceNumber === null) {
      this.toastr.warning('Please enter ending sequence number.');
      return false;
    }

    if(this.lastAWBStackNumber != null && this.startSequenceNumber != null && this.startSequenceNumber < this.lastAWBStackNumber){
      this.toastr.warning('Starting sequence number should be '+this.lastAWBStackNumber+'.');
      return false;
    }

    if(this.endSequenceNumber != null &&  this.startSequenceNumber != null && this.endSequenceNumber <= this.startSequenceNumber){
      this.toastr.warning('Ending sequence number should be greater than starting sequence number.');
      return false;
    }
    return true;
  }

  onChangeFilterFrm(event: any) {


  }



}
