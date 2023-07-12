import { ToastrService } from 'ngx-toastr';
import { SystemUserCreateRm } from 'src/app/_models/request-models/manage-user/system-user-create-rm.model';
import { SystemUserService } from './../../../../_services/system-user.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { CountryService } from 'src/app/_services/country.service';
import { AirportService } from 'src/app/_services/airport.service';
import { AccessPortalLevel, UserRole, UserStatus } from 'src/app/core/enums/common-enums';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';

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
  statusList: SelectList[] = [];
  accessLevels: SelectList[] = [];
  userRoles: SelectList[] = [];

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
    this.loadStatusList();
    this.loadAccessPortalLevels();
    this.loadUserRoles();
  }

  initializeForm() {
    this.userForm = this.fb.group({
      id:[null],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      userName: ['', [Validators.required,Validators.pattern("^[a-z._]+$")]],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      countryId: ['', [Validators.required]],
      baseAirportId: ['', [Validators.required]],
      city: ['', [Validators.required]],
      accessPortalLevel: [0, [Validators.required]],
      userRole: [0, [Validators.required]],
      userStatus: [0, [Validators.required]],
    });
  }

  loadStatusList() {
    this.statusList.push(
      { id: UserStatus.Active.toString(), value: CoreExtensions.GetUserStatus(UserStatus.Active) },
      { id: UserStatus.Pending.toString(), value: CoreExtensions.GetUserStatus(UserStatus.Pending) },
      { id: UserStatus.Suspended.toString(), value: CoreExtensions.GetUserStatus(UserStatus.Suspended) },

    );
  }

  loadAccessPortalLevels() {
    this.accessLevels.push(
      { id: AccessPortalLevel.Backoffice.toString(), value: CoreExtensions.GetAccessPortalLevel(AccessPortalLevel.Backoffice) },
      { id: AccessPortalLevel.Booking.toString(), value: CoreExtensions.GetAccessPortalLevel(AccessPortalLevel.Booking) },
      { id: AccessPortalLevel.WareHouse.toString(), value: CoreExtensions.GetAccessPortalLevel(AccessPortalLevel.WareHouse) },
    );
  }

  loadUserRoles() {
    this.userRoles.push(
      { id: UserRole.BackofficeAdmin.toString(), value: CoreExtensions.GetUserRole(UserRole.BackofficeAdmin) },
      { id: UserRole.BookingAdmin.toString(), value: CoreExtensions.GetUserRole(UserRole.BookingAdmin) },
      { id: UserRole.WarehouseAdmin.toString(), value: CoreExtensions.GetUserRole(UserRole.WarehouseAdmin) },
      { id: UserRole.BackofficeUser.toString(), value: CoreExtensions.GetUserRole(UserRole.BackofficeUser) },
      { id: UserRole.WarehouseUser.toString(), value: CoreExtensions.GetUserRole(UserRole.WarehouseUser) },
      { id: UserRole.BookingUser.toString(), value: CoreExtensions.GetUserRole(UserRole.BookingUser) },
    );
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

  selectedStatus(value: any) {
    this.userForm.get('userStatus')?.patchValue(+value.id);
  }

  onClearStatus() {
    this.userForm.get('userStatus')?.patchValue(null);
  }

  selectedAccessPortal(value: any) {
    this.userForm.get('accessPortalLevel')?.patchValue(+value.id);
  }

  onClearAccessPortal() {
    this.userForm.get('accessPortalLevel')?.patchValue(null);
  }

  selectedRole(value: any) {
    this.userForm.get('userRole')?.patchValue(+value.id);
  }

  onClearRole() {
    this.userForm.get('userRole')?.patchValue(null);
  }

  onSubmit() {
    if(this.userForm.valid) {
      this.createUser = this.userForm.value;
      console.log(this.createUser)
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
