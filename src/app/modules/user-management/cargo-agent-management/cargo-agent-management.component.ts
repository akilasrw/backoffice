import { CargoAgent } from './../../../_models/view-models/cargo-agent/CargoAgent';
import { Component, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CargoAgentFilterQuery } from 'src/app/_models/queries/cargo-agent/cargo-agent-filter-query';
import { CargoAgentService } from 'src/app/_services/cargo-agent.service';
import { CargoAgentStatus } from 'src/app/core/enums/common-enums';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { FormControl, FormGroup } from '@angular/forms';
import { CountryService } from 'src/app/_services/country.service';
import { AirportService } from 'src/app/_services/airport.service';

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
  cargoAgents: CargoAgent[]= [];
  totalCount: number = 0;
  keyword = 'value';
  modalVisibleAnimateAcceptAgent:boolean=false;
  modalVisibleAcceptAgent:boolean=false;
  selectedAgent?:CargoAgent =new CargoAgent();
  modalVisibleAnimateSuspendAgent:boolean=false;
  modalVisibleSuspendAgent:boolean=false;
  isEditModalVisible: boolean = false;
  isEditModalAnimateVisible: boolean = false;
  selectedId: string = '';
  countryList: SelectList[] = [];
  baseAirpots: SelectList[] = [];

  constructor(private cargoAgentService: CargoAgentService, private toastr: ToastrService, private countryService:CountryService, private airportService:AirportService) { }

  agentForm: FormGroup | undefined;
  selectedFile: File | null = null;

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  loadAirports() {
    this.airportService.getSelectList()
      .subscribe(res => {
        if (res.length > 0) {
          this.baseAirpots = res;
        }
      });
  }

  loadCountries(){
    this.countryService.getCountryList()
      .subscribe(res => {
        if(res.length > 0) {
          this.countryList = res;
        }
      });
  }

  selectedCountry(value: any){
    this.agentForm?.get('countryId')?.patchValue(value.id);
  }

  onClearCountry() {
    this.agentForm?.get('countryId')?.patchValue(null);
  }

  selectedBaseAirport(value: any) {
    this.agentForm?.get('baseAirportId')?.patchValue(value.id);
  }

  

  onClearBaseAirport() {
    this.agentForm?.get('baseAirportId')?.patchValue(null);
  }


  ngOnInit(): void {
    this.getCargoAgentList();
    this.loadStatusTypes();
    this.agentForm = new FormGroup({
      agentName: new FormControl(null),
      userName: new FormControl(null),
      phoneNumber: new FormControl(null),
      iataCode: new FormControl(null),
      country: new FormControl(null),
      city: new FormControl(null),
      baseAirPort: new FormControl(null),
      Agreement: new FormControl(null)
    })
    this.loadAirports()
    this.loadCountries()
  }

  onSubmit() {
    // Create a new FormData object
    const formData = new FormData();
  
    // Append form control values to the FormData object if they exist

    formData.append('id', this.selectedId)

    if (this?.agentForm?.get('agentName')?.value != null) {
      formData.append('agentName', this.agentForm.get('agentName')!.value);
    }
  
    if (this?.agentForm?.get('userName')?.value != null) {
      formData.append('userName', this.agentForm.get('userName')!.value);
    }
  
    if (this?.agentForm?.get('phoneNumber')?.value != null) {
      formData.append('PrimaryTelephoneNumber', this.agentForm.get('phoneNumber')!.value);
    }
  
    if (this?.agentForm?.get('iataCode')?.value != null) {
      formData.append('iataCode', this.agentForm.get('iataCode')!.value);
    }
  
    if (this?.agentForm?.get('country')?.value != null) {
      formData.append('country', this.agentForm.get('country')!.value);
    }
  
    if (this?.agentForm?.get('city')?.value != null) {
      formData.append('city', this.agentForm.get('city')!.value);
    }
  
    if (this?.agentForm?.get('baseAirPort')?.value != null) {
      formData.append('baseAirPort', this.agentForm.get('baseAirPort')!.value);
    }
  
    if (this.selectedFile) {
      formData.append('AgreementFile', this.selectedFile)
    }

    if (this?.agentForm?.get('city')?.value != null) {
      formData.append('City', this.agentForm.get('city')!.value);
    }
  
     this.cargoAgentService.updateAgent(formData).subscribe((x)=> console.log(x))
   
  }


 

  loadStatusTypes() {
    this.agentStatus.push({ id: CargoAgentStatus.None.toString(), value: "All" },
      { id: CargoAgentStatus.Pending.toString(), value: CoreExtensions.GetCargoAgentStaus(CargoAgentStatus.Pending) },
      { id: CargoAgentStatus.Active.toString(), value: CoreExtensions.GetCargoAgentStaus(CargoAgentStatus.Active) },
      { id: CargoAgentStatus.Suspended.toString(), value: CoreExtensions.GetCargoAgentStaus(CargoAgentStatus.Suspended) });
  }

  openEditModal(id:string, name:string, username:string, telephone:string, iataCode:string, city:string) {
    this?.agentForm?.get('agentName')?.setValue(name);
  this?.agentForm?.get('userName')?.setValue(username);
  this?.agentForm?.get('phoneNumber')?.setValue(telephone);
  this?.agentForm?.get('iataCode')?.setValue(iataCode);
  this?.agentForm?.get('city')?.setValue(city);
    this.isEditModalVisible = true;
    this.selectedId = id;
    setTimeout(() => (this.isEditModalAnimateVisible = true));
  }

  closeEditModel(){
    this.isEditModalVisible = false;
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
            this.toastr.success((this.selectedAgent!.status == CargoAgentStatus.Active)?"Cargo agent successfully activated.":"Cargo agent successfully suspended.");
            (this.selectedAgent!.status == CargoAgentStatus.Active)? this.cancelActive() : this.cancelSuspend();
            this.cargoAgents = [];
            this.isLoading=false;
            this.getCargoAgentList();
          },
          error: (error) => {
            this.toastr.error((this.selectedAgent!.status == CargoAgentStatus.Active)?"Cargo agent unable to activate.":"Cargo agent unable to suspend.");
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
