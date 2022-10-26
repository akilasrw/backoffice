import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { AwbNumberStackService } from 'src/app/_services/awb-number-stack.service';
import { AWBNumberStackFilterQuery } from 'src/app/_models/queries/awb-number-stack/awb-number-stack-filter-query.model';
import { AWBNumberStatus } from 'src/app/core/enums/common-enums';
import { AWBNumberStack } from 'src/app/_models/view-models/awb-number-stack/awb-number-stack.model';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { CommonMessages } from 'src/app/core/constants/common-messages';

@Component({
  selector: 'app-awb-stack-management-manual',
  templateUrl: './awb-stack-management-manual.component.html',
  styleUrls: ['./awb-stack-management-manual.component.scss']
})
export class AwbStackManagementManualComponent implements OnInit {

  keyword = 'value';
  cargoAgents: SelectList[] = [];
  isLoading: boolean = false;
  cargoAgentId?: string;
  awbForm!: FormGroup;
  cargoAgentName?: string;
  aWBNumberStatus?: AWBNumberStatus;
  awbStackFilterQuery: AWBNumberStackFilterQuery = new AWBNumberStackFilterQuery();
  awbNumberStackList: AWBNumberStack[] = []
  totalCount: number = 0;
  filterFormHasValue: boolean = false;
  awbStatus: SelectList[] = [];
  selectedDeletedID?:string;
  modalVisibleAnimateDelete:boolean = false;
  modalVisibleDelete:boolean = false;
  selectedAWBNumber?:AWBNumberStack;

  constructor(
    private awbSerice: AwbNumberStackService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loadAWBNumbers();
    this.loadStatusTypes();
  }

  loadStatusTypes() {
    this.awbStatus.push({ id: AWBNumberStatus.All.toString(), value: CoreExtensions.GetAWBStaus(AWBNumberStatus.All) },
      { id: AWBNumberStatus.Avilable.toString(), value: CoreExtensions.GetAWBStaus(AWBNumberStatus.Avilable) },
      { id: AWBNumberStatus.Used.toString(), value: CoreExtensions.GetAWBStaus(AWBNumberStatus.Used) });
  }

  loadAWBNumbers() {
    this.isLoading = true;
    this.awbStackFilterQuery.cargoAgentName = this.cargoAgentName;
    this.awbStackFilterQuery.isAgentInclude = true;
    this.awbStackFilterQuery.aWBNumberStatus = this.aWBNumberStatus;
    this.awbSerice.getFilteredList(this.awbStackFilterQuery)
      .subscribe({
        next: (res) => {
          this.awbNumberStackList = res.data
          this.totalCount = res.count
          this.isLoading = false;
        },
        error: (error) => {
          this.totalCount = 0;
          this.awbNumberStackList = [];
          this.isLoading = false;
        }
      }
      );
  }

  onAWBNumberAdd(event : any){
   this.loadAWBNumbers();
  }

  selectedCargoAgent(value: any) {
    this.cargoAgentId = value.id;
  }

  selectedStatus(value: any) {
    this.aWBNumberStatus = Number(value.id);
  }

  onClearStatus() {
    this.aWBNumberStatus = undefined;
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

  onDelete(awbId: string) {
    this.selectedDeletedID = awbId;
    this.showDelete();
  }

  public onPageChanged(event: any) {
    if (this.awbStackFilterQuery?.pageIndex !== event) {
      this.awbStackFilterQuery.pageIndex = event;
      this.loadAWBNumbers();
    }
  }

  showDelete() {
    this.modalVisibleDelete = true;
    setTimeout(() => (this.modalVisibleAnimateDelete = true));
  }

  cancelDelete() {
    this.selectedDeletedID = '';
    this.modalVisibleAnimateDelete = false;
    setTimeout(() => (this.modalVisibleDelete = false), 300);
  }

  deleteAWBNumber() {
    if (this.selectedDeletedID) {
      this.awbSerice.deleteAWBNumber(this.selectedDeletedID)
        .subscribe({
          next: (res) => {
            this.toastr.success(CommonMessages.DeletedSuccessMsg);
            this.cancelDelete();
            this.awbNumberStackList = [];
            this.loadAWBNumbers();
          },
          error: (error) => {
            this.toastr.error(CommonMessages.DeleteFailMsg);
            this.cancelDelete();
          }
        });
    }
  }

  onEdit(item:AWBNumberStack){
    this.selectedAWBNumber = item;
  }

}
