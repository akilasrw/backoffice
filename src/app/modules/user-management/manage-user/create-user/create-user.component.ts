import { ToastrService } from 'ngx-toastr';
import { SystemUserCreateRm } from 'src/app/_models/request-models/manage-user/system-user-create-rm.model';
import { SystemUserService } from './../../../../_services/system-user.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { CountryService } from 'src/app/_services/country.service';
import { AirportService } from 'src/app/_services/airport.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  userForm!: FormGroup;
  createUser: SystemUserCreateRm = new SystemUserCreateRm();
  isLoading: boolean = false;
  countryList: SelectList[] = [];
  baseAirpots: SelectList[] = [];
  keyword = 'value';
  @Output() closePopup = new EventEmitter<any>();
  @Output() submitSuccess = new EventEmitter<any>();

  constructor(private systemUserService: SystemUserService,
    private fb: FormBuilder,
    private countryService: CountryService,
    private airportService: AirportService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCountries();
    this.loadAirports();
  }

  initializeForm() {
    this.userForm = this.fb.group({
      id:[null],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required]],
      countryId: ['', [Validators.required]],
      baseAirportId: ['', [Validators.required]],
      city: ['', [Validators.required]],
      accessPortalLevel: [0, [Validators.required]],
      userRole: [0, [Validators.required]],
      userStatus: [0, [Validators.required]],
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
    this.userForm.get('countryId')?.patchValue(value.id);
  }

  onClearCountry() {
    this.userForm.get('countryId')?.patchValue(null);
  }

  selectedBaseAirport(value: any) {
    this.userForm.get('baseAirportId')?.patchValue(value.id);
  }

  onClearBaseAirport() {
    this.userForm.get('baseAirportId')?.patchValue(null);
  }


  onSubmit() {
    if(this.userForm.valid) {
      this.createUser = this.userForm.value;
        this.systemUserService.create(this.createUser).subscribe(
          {
            next: (res) => {
              this.toastr.success('Saved successfully.');
              this.submitSuccess.emit();
              this.closeModal();
              this.isLoading = false;
            },
            error: (err) => {
              this.isLoading = false;
            }
          }
        );
    } else {
      this.userForm.markAllAsTouched();;
    }
  }

  closeModal() {
    this.closePopup.emit();
  }

}
