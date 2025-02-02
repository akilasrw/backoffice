import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { SelectItemList, SelectList } from 'src/app/shared/models/select-list.model';
import { AgentRateManagementRM } from 'src/app/_models/request-models/rate/agent-rate-management-rm';
import { AgentRateManagement } from 'src/app/_models/view-models/rate/agent-rate-management';
import { AirportService } from 'src/app/_services/airport.service';
import { CargoAgentService } from 'src/app/_services/cargo-agent.service';
import { RateService } from 'src/app/_services/rate.service';
import { formatDate } from '@angular/common';
import { CargoType, RateType } from 'src/app/core/enums/common-enums';

@Component({
  selector: 'app-rate-update',
  templateUrl: './rate-update.component.html',
  styleUrls: ['./rate-update.component.scss']
})
export class RateUpdateComponent implements OnInit {

  @Output() closePopup = new EventEmitter<any>();
  @Output() submitSuccess = new EventEmitter<any>();
  @Input() rateId?: string;
  rateDetail?: AgentRateManagement;
  cargoAgents: SelectList[] = [];
  originAirpots: SelectList[] = [];
  destinationAirpots: SelectList[] = [];
  editAgentIndex?: number;
  editOriginIndex?: number;
  editDestinationIndex?: number;
  editRateTypeIndex?: number;
  editCargoTypeIndex?: number;
  isLoading: boolean = false;
  keyword = 'value';
  rateForm!: FormGroup;
  startMinDate = new Date();
  endMinDate = new Date();
  isDisabled = true;
  rateTypes:SelectItemList[]=[];
  cargoTypes:SelectList[]=[];

  constructor(
    private cargoAgentService: CargoAgentService,
    private airportService: AirportService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private rateService: RateService
  ) { }

  ngOnInit(): void {
  this.initializeForm();
    this.getDetail();
  }

  getDetail() {
    if (this.rateId != null) {
      this.isLoading = true;
      this.rateService.getDetail({ id: this.rateId, includeCargoAgent: true }).subscribe(
        {
          next: (res) => {
            this.rateDetail = res;
            this.isLoading = false;
            this.loadAirports();
            this.loadCargoAgents();
            this.loadRateTypes();
            this.loadCargoTypes();
            this.patchValues(this.rateDetail);
          },
          error: (error) => {
            this.isLoading = false;
          }
        }
      );
    }
  }

  loadAirports() {
    this.isLoading = true;
    this.airportService.getSelectList()
      .subscribe(res => {
        if (res.length > 0) {
          this.originAirpots = res;
          Object.assign(this.destinationAirpots, res);
          this.editOriginIndex = this.originAirpots.findIndex(x => x.id == this.rateDetail?.originAirportId);
          this.editDestinationIndex = this.destinationAirpots.findIndex(x => x.id == this.rateDetail?.destinationAirportId);
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
            this.editAgentIndex = this.cargoAgents.findIndex(x => x.id == this.rateDetail?.cargoAgentId);
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
        }
      }
      );
  }

  loadRateTypes(){
    this.rateTypes = [{id:RateType.SpotRate,value:this.GetRateType(RateType.SpotRate)},
      {id:RateType.PromotionalRate,value:this.GetRateType(RateType.PromotionalRate)},
      {id:RateType.ContractRate,value:this.GetRateType(RateType.ContractRate)},
      {id:RateType.MarketPublishRate,value:this.GetRateType(RateType.MarketPublishRate)}]

      this.editRateTypeIndex = this.rateTypes.findIndex(x=>x.id==this.rateDetail?.rateType);
  }

  loadCargoTypes(){
    this.cargoTypes=[{id:CargoType.General.toString(),value:this.GetCargoType(CargoType.General)}]
    this.editCargoTypeIndex = this.cargoTypes.findIndex(x=>x.id==this.rateDetail?.cargoType);
  }

  initializeForm() {
    this.rateForm = this.fb.group({
      id: new FormControl(null, [Validators.required]),
      rateType: new FormControl(null,[Validators.required]),
      cargoType: new FormControl(null,[Validators.required]),
      cargoAgentId: new FormControl(null),
      originAirportId: new FormControl(null, [Validators.required]),
      destinationAirportId: new FormControl(null, [Validators.required]),
      startDate: new FormControl(null,[Validators.required]),
      endDate: new FormControl(null,[Validators.required]),
      agentRates: this.fb.array([]),
      isActive: new FormControl(null),
    });

  }

  patchValues(rateDetail: AgentRateManagement) {
    this.rateForm.patchValue({
      id: rateDetail.id,
      rateType: rateDetail.rateType,
      cargoType: rateDetail.cargoType,
      cargoAgentId: rateDetail.cargoAgentId,
      originAirportId: rateDetail.originAirportId,
      destinationAirportId: rateDetail.destinationAirportId,
      isActive:rateDetail.isActive,
    });

    this.rateForm.get('startDate')?.patchValue(formatDate(rateDetail.startDate!.toString(), 'MM-dd-yyyy', 'en-US'));
    this.rateForm.get('endDate')?.patchValue(formatDate(rateDetail.endDate!.toString(), 'MM-dd-yyyy', 'en-US'));

    rateDetail?.agentRates?.forEach(obj => {
      this.agentRates.push(this.fb.group({
        id: [obj.id],
        agentRateManagementId: [obj.agentRateManagementId],
        rate: [obj.rate, [Validators.required, Validators.min(1)]],
        weightType: [obj.weightType],
      }));
    });
  }

  get agentRates() {
    return this.rateForm.controls["agentRates"] as FormArray;
  }

  selectedCargoAgent(value: any) {
    this.rateForm.get('cargoAgentId')?.patchValue(value.id);
  }

  onClearCargoAgent() {
    this.rateForm.get('cargoAgentId')?.patchValue(null);
  }

  selectedRateType(value: any) {
    this.rateForm.get('rateType')?.patchValue(value.id);
  }

  onClearRateType() {
    this.rateForm.get('rateType')?.patchValue(null);
  }

  selectedCargoType(value: any) {
    this.rateForm.get('cargoType')?.patchValue(value.id);
  }

  onClearCargoType() {
    this.rateForm.get('cargoType')?.patchValue(null);
  }

  selectedOrigin(value: any) {
    this.rateForm.get('originAirportId')?.patchValue(value.id);
  }

  onClearOrigin() {
    this.rateForm.get('originAirportId')?.patchValue(null);
  }

  selectedDestination(value: any) {
    this.rateForm.get('destinationAirportId')?.patchValue(value.id);
  }

  onClearDestination() {
    this.rateForm.get('destinationAirportId')?.patchValue(null);
  }

  closeModal() {
    this.rateForm.reset();
    this.closePopup.emit();
  }

  GetWeightType(type: number) {
    return CoreExtensions.GetWeightType(type);
  }

  updateRate() {

    if (this.rateForm.get('rateType')?.value === null || this.rateForm.get('rateType')?.value === "") {
      this.toastr.error('Please select rate type.');
      return;
    }

    if (this.rateForm.get('cargoType')?.value === null || this.rateForm.get('cargoType')?.value === "") {
      this.toastr.error('Please select cargo type.');
      return;
    }

    if (this.rateForm.get('rateType')?.value === RateType.MarketPublishRate) {
      this.rateForm.get('cargoAgentId')?.patchValue(null); 
    }

    if (this.rateForm.get('rateType')?.value == RateType.ContractRate && (this.rateForm.get('cargoAgentId')?.value === null || this.rateForm.get('cargoAgentId')?.value === "")) {
      this.toastr.error('Please select cargo agent.');
      return;
    }
    
    if (this.rateForm.get('originAirportId')?.value === null || this.rateForm.get('originAirportId')?.value === "") {
      this.toastr.error('Please select origin airport.');
      return;
    }
    
    if (this.rateForm.get('destinationAirportId')?.value === null || this.rateForm.get('destinationAirportId')?.value === "") {
      this.toastr.error('Please select destination airport.');
      return;
    }
    
    if (this.rateForm.get('originAirportId')?.value === this.rateForm.get('destinationAirportId')?.value) {
      this.toastr.error('Origin and destination same.');
      return;
    }
    
    if (this.rateForm.get('startDate')?.value === null) {
      this.toastr.error('Please start date.');
      return;
    }
    
    if (this.rateForm.get('agentRates')?.value === null) {
      this.toastr.error('Please add rates.');
      return;
    }
    
    if (this.rateForm.get('endDate')?.value === null) {
      this.toastr.error('Please end date.');
      return;
    }
    
    if (this.rateForm.get('startDate')?.value >= this.rateForm.get('endDate')?.value) {
      this.toastr.error('The end date should be greater than the start date.');
      return;
    }
    
    if (this.rateForm.valid) {
      this.isLoading = true;
      var rateManagement: AgentRateManagementRM = new AgentRateManagementRM();
      rateManagement = this.rateForm.value;
      rateManagement.startDate = moment(this.rateForm.get('startDate')?.value).format('YYYY-MM-DDThh:mm:ssZ');
      rateManagement.endDate = moment(this.rateForm.get('endDate')?.value).format('YYYY-MM-DDThh:mm:ssZ');
     

      this.rateService.update(rateManagement).subscribe({
        next: (res) => {
          this.toastr.success('Rate updated successfully.');
          this.submitSuccess.emit();
          this.closeModal();
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
        }
      })
      this.rateForm.markAsUntouched();
    } else {
      this.rateForm.markAllAsTouched();
    }
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

}
