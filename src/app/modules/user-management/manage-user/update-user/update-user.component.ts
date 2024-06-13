import { ToastrService } from 'ngx-toastr';
import { SystemUserCreateRm } from 'src/app/_models/request-models/manage-user/system-user-create-rm.model';
import { SystemUserService } from '../../../../_services/system-user.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { CountryService } from 'src/app/_services/country.service';
import { AirportService } from 'src/app/_services/airport.service';
import { AccessPortalLevel, UserRole, UserStatus } from 'src/app/core/enums/common-enums';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {

  userForm!: FormGroup;
  createUser: SystemUserCreateRm = new SystemUserCreateRm();
  isLoading: boolean = false;
  countryList: SelectList[] = [];
  baseAirpots: SelectList[] = [];
  keyword = 'value';
  statusList: SelectList[] = [];
  accessLevels: SelectList[] = [];
  userRoles: SelectList[] = [];
  selectedCountryValue:number =  0;
  selectedAirportValue:number =  0;
  selectedUserRoleValue:number =  0;
  selectedAccessPortalValue:number =  0;
  selectedStatusValue:number =  0;

  @Output() closePopup = new EventEmitter<any>();
  @Output() submitSuccess = new EventEmitter<any>();
  @Input() userData: any;
  @Input() userID: any;

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
    console.log(this.userData)
    this.userForm = this.fb.group({
      id:[null],
      firstName: [this.userData.firstName, [Validators.required]],
      lastName: [this.userData.lastName, [Validators.required]],
      userName: [this.userData.userName, [Validators.required,Validators.pattern("^[a-z._]+$")]],
      phoneNumber: [this.userData.phoneNumber, [Validators.required]],
      email: [this.userData.email, [Validators.required, Validators.email]],
      countryId: [this.userData.countryId, [Validators.required]],
      baseAirportId: [this.userData.baseAirportId, [Validators.required]],
      city: [this.userData.city, [Validators.required]],
      accessPortalLevel: [this.userData.accessPortalLevel, [Validators.required]],
      userRole: [this.userData.userRole, [Validators.required]],
      userStatus: [this.userData.userStatus, [Validators.required]],
    });

   
  }

  loadStatusList() {
    this.statusList.push(
      { id: UserStatus.Active.toString(), value: CoreExtensions.GetUserStatus(UserStatus.Active) },
      { id: UserStatus.Pending.toString(), value: CoreExtensions.GetUserStatus(UserStatus.Pending) },
      { id: UserStatus.Suspended.toString(), value: CoreExtensions.GetUserStatus(UserStatus.Suspended) },

    );

    if(this.userData.userStatus){
      this.selectedStatusValue = this.statusList.findIndex((x)=> x.id == this.userData.userStatus) || 0;
    }
  }

  loadAccessPortalLevels() {
    this.accessLevels.push(
      { id: AccessPortalLevel.Backoffice.toString(), value: CoreExtensions.GetAccessPortalLevel(AccessPortalLevel.Backoffice) },
      { id: AccessPortalLevel.Booking.toString(), value: CoreExtensions.GetAccessPortalLevel(AccessPortalLevel.Booking) },
      { id: AccessPortalLevel.WareHouse.toString(), value: CoreExtensions.GetAccessPortalLevel(AccessPortalLevel.WareHouse) },
    );

    if(this.userData.accessPortalLevel){
      this.selectedAccessPortalValue = this.accessLevels.findIndex((x)=> x.id == this.userData.accessPortalLevel) || 0;
    }
  }

  loadUserRoles() {
    this.userRoles.push(
      { id: UserRole.BackofficeAdmin.toString(), value: CoreExtensions.GetUserRole(UserRole.BackofficeAdmin) },
      { id: UserRole.BookingAdmin.toString(), value: CoreExtensions.GetUserRole(UserRole.BookingAdmin) },
      { id: UserRole.WarehouseAdmin.toString(), value: CoreExtensions.GetUserRole(UserRole.WarehouseAdmin) },
      { id: UserRole.BackofficeUser.toString(), value: CoreExtensions.GetUserRole(UserRole.BackofficeUser) },
      { id: UserRole.WarehouseUser.toString(), value: CoreExtensions.GetUserRole(UserRole.WarehouseUser) },
      { id: UserRole.BookingUser.toString(), value: CoreExtensions.GetUserRole(UserRole.BookingUser) },
      { id: UserRole.TruckDriver.toString(), value: CoreExtensions.GetUserRole(UserRole.TruckDriver) },
    );

    if(this.userData.userRole){
      this.selectedUserRoleValue = this.userRoles.findIndex((x)=> x.id == this.userData.userRole) || 0;
    }
  }

  loadAirports() {
    this.airportService.getSelectList()
      .subscribe(res => {
        if (res.length > 0) {
          this.baseAirpots = res;
          if(this.userData.baseAirportId){
            this.selectedAirportValue = this.baseAirpots.findIndex((x)=> x.id == this.userData.baseAirportId) || 0;
          }
        }
      });
  }

  loadCountries(){
    this.countryService.getCountryList()
      .subscribe(res => {
        if(res.length > 0) {
          this.countryList = res;
          if(this.userData.countryId){
            this.selectedCountryValue = this.countryList.findIndex((x)=> x.id == this.userData.countryId) || 0;
          }
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
        this.systemUserService.update(this.createUser, this.userID).subscribe(
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
