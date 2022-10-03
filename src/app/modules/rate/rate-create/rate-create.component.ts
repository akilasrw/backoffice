import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { WeightType } from 'src/app/core/enums/common-enums';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
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
  originAirpots: SelectList[] = [];
  destinationAirpots: SelectList[] = [];
  agentRateManagementListRM = new AgentRateManagementListRM();
  agentRateManagements: AgentRateManagementRM[] = [];
  isLoading: boolean = false;
  keyword = 'value';
  rateForm!: FormGroup;


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

  initializeForm() {
    this.rateForm = this.fb.group({
      cargoAgentId: new FormControl(null, [Validators.required]),
      originAirportId: new FormControl(null, [Validators.required]),
      destinationAirportId: new FormControl(null, [Validators.required]),
      originAirportCode: new FormControl(null),
      destinationAirportCode: new FormControl(null),
      agentRates: this.fb.array([]),
    });

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

    if (this.rateForm.get('agentRates')?.value === null) {
      this.toastr.error('Please add rates.');
      return;
    }
    if (this.rateForm.valid) {
      console.log(this.rateForm.value);
      this.agentRateManagements.push(this.rateForm.value);
      this.rateForm.reset();
      this.rateForm.markAsUntouched();
      this.initializeForm();
    } else {
      this.rateForm.markAllAsTouched();
    }
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
  }

  onClearCargoAgent() {
    this.rateForm.get('cargoAgentId')?.patchValue(null);
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

  onDelete(agentRateManagement: AgentRateManagementRM) {
    const index = this.agentRateManagements?.indexOf(agentRateManagement);
    if (index !== -1) {
      this.agentRateManagements?.splice(Number(index), 1);
    }
  }

}
