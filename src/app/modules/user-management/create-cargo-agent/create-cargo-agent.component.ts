import { Component, OnInit } from '@angular/core';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { CountryService } from 'src/app/_services/country.service';
import { AirportService } from 'src/app/_services/airport.service';

@Component({
  selector: 'app-create-cargo-agent',
  templateUrl: './create-cargo-agent.component.html',
  styleUrls: ['./create-cargo-agent.component.scss']
})
export class CreateCargoAgentComponent implements OnInit {
  public cargoAgentForm!: FormGroup;
  isLoading: boolean = false;
  countryList: SelectList[] = [];
  baseAirpots: SelectList[] = [];
  keyword = 'value';
  statusList: SelectList[] = [];
  modalVisible = false;
  modalVisibleAnimate = false;

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private airportService: AirportService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.cargoAgentForm = new FormGroup({
      agentName: new FormControl(null, [Validators.required]),
      userName: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      primaryTelephoneNumber: new FormControl(null,[Validators.required]),
      secondaryTelephoneNumber: new FormControl(null),
      email: new FormControl(null,[Validators.required,Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      cargoAccountNumber: new FormControl(null),
      countryId: new FormControl(null,[Validators.required]), 
      baseAirportId:new FormControl(null,[Validators.required]),
      city: new FormControl(null,[Validators.required]),
      agentIATACode: new FormControl(null),
      password: new FormControl(null,[Validators.required,Validators.minLength(8)]),
      confirmPassword: new FormControl(null,[Validators.required,Validators.minLength(8)]),
    });
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
    this.cargoAgentForm.get('countryId')?.patchValue(value.id);
  }

  onClearCountry() {
    this.cargoAgentForm.get('countryId')?.patchValue(null);
  }

  selectedBaseAirport(value: any) {
    this.cargoAgentForm.get('baseAirportId')?.patchValue(value.id);
  }

  onClearBaseAirport() {
    this.cargoAgentForm.get('baseAirportId')?.patchValue(null);
  }

  close() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

}
