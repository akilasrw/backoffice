import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CargoType, RateType, WeightType } from 'src/app/core/enums/common-enums';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { AutoCompleteDropdownComponent } from 'src/app/shared/components/forms/auto-complete-dropdown/auto-complete-dropdown.component';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { AgentRateManagementListRM } from 'src/app/_models/request-models/rate/agent-rate-management-list-rm';
import { AgentRateManagementRM } from 'src/app/_models/request-models/rate/agent-rate-management-rm';
import { AirportService } from 'src/app/_services/airport.service';
import { CargoAgentService } from 'src/app/_services/cargo-agent.service';
import { RateService } from 'src/app/_services/rate.service';

@Component({
  selector: 'app-rate-create',
  templateUrl: './rate-create.component.html',
  styleUrls: ['./rate-create.component.scss']
})
export class RateCreateComponent implements OnInit {

  @Output() closePopup = new EventEmitter<any>();
  @Output() submitSuccess = new EventEmitter<any>();
  cargoAgents: SelectList[] = [];
  rateTypes:SelectList[]=[];
  cargoTypes:SelectList[]=[];
  originAirpots: SelectList[] = [];
  destinationAirpots: SelectList[] = [];
  agentRateManagementListRM = new AgentRateManagementListRM();
  agentRateManagements: AgentRateManagementRM[] = [];
  isLoading: boolean = false;
  keyword = 'value';
  rateForm!: FormGroup;
  startMinDate = new Date();
  endMinDate = new Date();
  @ViewChild('autoCompleteCargoAgent') autoCompleteCargoAgent!: AutoCompleteDropdownComponent;
  @ViewChild('autoCompleteRateType') autoCompleteRateType!: AutoCompleteDropdownComponent;
  @ViewChild('autoCompleteCargoType') autoCompleteCargoType!: AutoCompleteDropdownComponent;
  @ViewChild('autoCompleteOrigin') autoCompleteOrigin!: AutoCompleteDropdownComponent;
  @ViewChild('autoCompleteDestination') autoCompleteDestination!: AutoCompleteDropdownComponent;

  constructor(
    private cargoAgentService: CargoAgentService,
    private airportService: AirportService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private rateService: RateService

  ) { }

  ngOnInit(): void {
    this.loadAirports();
    this.loadCargoAgents();
    this.initializeForm();
    this.loadRateTypes();
    this.loadCargoTypes();
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

  loadRateTypes(){
    this.rateTypes = [{id:RateType.SpotRate.toString(),value:this.GetRateType(RateType.SpotRate)},
      {id:RateType.PromotionalRate.toString(),value:this.GetRateType(RateType.PromotionalRate)},
      {id:RateType.ContractRate.toString(),value:this.GetRateType(RateType.ContractRate)},
      {id:RateType.MarketPublishRate.toString(),value:this.GetRateType(RateType.MarketPublishRate)}]
  }

  loadCargoTypes(){
    this.cargoTypes=[{id:CargoType.General.toString(),value:this.GetCargoType(CargoType.General)}]
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

  initializeForm() {
    this.rateForm = this.fb.group({
      rateType: new FormControl(null,[Validators.required]),
      cargoType: new FormControl(null,[Validators.required]),
      cargoAgentId: new FormControl(null, [Validators.required]),
      cargoAgentName:new FormControl(null),
      originAirportId: new FormControl(null, [Validators.required]),
      destinationAirportId: new FormControl(null, [Validators.required]),
      originAirportCode: new FormControl(null),
      destinationAirportCode: new FormControl(null),
      startDate: new FormControl(null,[Validators.required]),
      endDate: new FormControl(null,[Validators.required]),
      agentRates: this.fb.array([]),
    });
    this.pushRateClassType();
  }

  pushRateClassType(){
    this.agentRates.push(this.fb.group({
      rate: [0, [Validators.required, Validators.min(1)]],
      weightType: [WeightType.M],
    }));
    this.agentRates.push(this.fb.group({
      rate: [0, [Validators.required, Validators.min(1)]],
      weightType: [WeightType.Minus45K],
    }));
    this.agentRates.push(this.fb.group({
      rate: [0, [Validators.required, Validators.min(1)]],
      weightType: [WeightType.Plus45K],
    }));
    this.agentRates.push(this.fb.group({
      rate: [0, [Validators.required, Validators.min(1)]],
      weightType: [WeightType.Plus100K],
    }));
    this.agentRates.push(this.fb.group({
      rate: [0, [Validators.required, Validators.min(1)]],
      weightType: [WeightType.Plus300K],
    }));
    this.agentRates.push(this.fb.group({
      rate: [0, [Validators.required, Validators.min(1)]],
      weightType: [WeightType.Plus500K],
    }));
    this.agentRates.push(this.fb.group({
      rate: [0, [Validators.required, Validators.min(1)]],
      weightType: [WeightType.Plus1000K],
    }));
  }

  get agentRates() {
    return this.rateForm.controls["agentRates"] as FormArray;
  }


  addRate() {
    if (this.rateForm.get('cargoAgentId')?.value === null || this.rateForm.get('cargoAgentId')?.value === "") {
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

    if (this.rateForm.get('agentRates')?.value === null) {
      this.toastr.error('Please add rates.');
      return;
    }

    if (this.rateForm.get('startDate')?.value === null) {
      this.toastr.error('Please start date.');
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

    if(this.isFlightExist()){
      this.toastr.error('Selected flight(origin and destination) already exist.');
      return;
    }

    if (this.rateForm.valid) {
      var createdRate = this.rateForm.value;
      createdRate.startDate = moment(this.rateForm.get('startDate')?.value).format('YYYY-MM-DDThh:mm:ssZ');
      createdRate.sndDate = moment(this.rateForm.get('endDate')?.value).format('YYYY-MM-DDThh:mm:ssZ');
      this.agentRateManagements.push(createdRate);
      this.clearFormArray(<FormArray>this.rateForm.controls['agentRates'])
      this.pushRateClassType();
    } else {
      this.rateForm.markAllAsTouched();
    }
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  clearFields(event: any) {
    this.rateForm.reset();
    this.rateForm.markAsUntouched();
    this.initializeForm();
    this.clearDropdowns(event);
  }

  isFlightExist():boolean{
    var isExist = false;
    this.agentRateManagements.forEach(obj =>{
      if(obj.cargoAgentId === this.rateForm.get('cargoAgentId')?.value &&
        obj.originAirportId === this.rateForm.get('originAirportId')?.value &&
      obj.destinationAirportId === this.rateForm.get('destinationAirportId')?.value){
        isExist = true
        return;
      }
    });
    return isExist;
  }

  saveRate() {
    if (this.agentRateManagements === undefined || this.agentRateManagements!.length < 1) {
      this.toastr.error('Please add rates before save.');
      return;
    }

    this.agentRateManagementListRM.agentRateManagements = this.agentRateManagements;

    this.rateService.create(this.agentRateManagementListRM).subscribe({
      next: (res) => {
        this.toastr.success('Rate created successfully.');
        this.submitSuccess.emit();
        this.closeModal();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      }
    })

  }

  selectedCargoAgent(value: any) {
    this.rateForm.get('cargoAgentId')?.patchValue(value.id);
    this.rateForm.get('cargoAgentName')?.patchValue(value.value);    
  }

  onClearCargoAgent() {
    this.rateForm.get('cargoAgentId')?.patchValue(null);
    this.rateForm.get('cargoAgentName')?.patchValue(null);    
  }

  selectedRateType(value: any) {
    this.rateForm.get('rateType')?.patchValue(+value.id);
  }

  onClearRateType() {
    this.rateForm.get('rateType')?.patchValue(null);
  }

  selectedCargoType(value: any) {
    this.rateForm.get('cargoType')?.patchValue(+value.id);
  }

  onClearCargoType() {
    this.rateForm.get('cargoType')?.patchValue(null);
  }

  selectedOrigin(value: any) {
    this.rateForm.get('originAirportId')?.patchValue(value.id);
    this.rateForm.get('originAirportCode')?.patchValue(value.value.substring(0, 3));
  }

  onClearOrigin() {
    this.rateForm.get('originAirportId')?.patchValue(null);
    this.rateForm.get('originAirportCode')?.patchValue(null);
  }

  selectedDestination(value: any) {
    this.rateForm.get('destinationAirportId')?.patchValue(value.id);
    this.rateForm.get('destinationAirportCode')?.patchValue(value.value.substring(0, 3));
  }

  onClearDestination() {
    this.rateForm.get('destinationAirportId')?.patchValue(null);
    this.rateForm.get('destinationAirportCode')?.patchValue(null);
  }

  closeModal() {
    this.rateForm.reset();
    this.closePopup.emit();
  }

  GetWeightType(type: number) {
    return CoreExtensions.GetWeightType(type);
  }

  GetRateType(type:number){
    return CoreExtensions.GetRateType(type);
  }

  GetCargoType(type:number){
    return CoreExtensions.GetCargoType(type);
  }

  onDelete(agentRateManagement: AgentRateManagementRM) {
    const index = this.agentRateManagements?.indexOf(agentRateManagement);
    if (index !== -1) {
      this.agentRateManagements?.splice(Number(index), 1);
    }
  }

  onEdit(agentRateManagement: AgentRateManagementRM){

  }

  clearDropdowns(e: any): void {
    e.stopPropagation();
    this.autoCompleteCargoAgent.clear();
    this.autoCompleteRateType.clear();
    this.autoCompleteCargoType.clear();
    this.autoCompleteDestination.clear();
    this.autoCompleteOrigin.clear();
  }

}
