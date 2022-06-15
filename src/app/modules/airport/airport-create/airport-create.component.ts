import { SelectList } from './../../../shared/models/select-list.model';
import { CountryService } from './../../../_services/country.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AirportCreateRM } from 'src/app/_models/request-models/airport/airport-create-rm';
import { AirportService } from 'src/app/_services/airport.service';

@Component({
  selector: 'app-airport-create',
  templateUrl: './airport-create.component.html',
  styleUrls: ['./airport-create.component.scss']
})
export class AirportCreateComponent implements OnInit {

  countryList: SelectList[] = [];
  public airportForm!: FormGroup;
  keyword = 'value';
  @Output() closePopup = new EventEmitter<any>();
  @Output() submitSuccess = new EventEmitter<any>();



  constructor(private countryService: CountryService,
    private airportService: AirportService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadCountries();
    this.initializeAirportForm();
  }

  initializeAirportForm() {
    this.airportForm = new FormGroup({
      countryId: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      code: new FormControl(null, [Validators.required, Validators.pattern("^[a-zA-Z]+$"), Validators.maxLength(3)]),
      lat: new FormControl(null, [Validators.required, Validators.pattern("^[0-9/./]*$")]),
      lon: new FormControl(null, [Validators.required, Validators.pattern("^[0-9/./]*$")]),
      latitudeDirection: new FormControl(null, [Validators.required]),
      longitudeDirection: new FormControl(null, [Validators.required]),
    });
  }

  loadCountries() {
    this.countryService.getCountryList()
      .subscribe(res => {
        if (res.length > 0) {
          this.countryList = res;
        }
      });
  }

  selectedCountry(value: any) {
    this.airportForm.get('countryId')?.patchValue(value.id);
  }

  saveAirportDetails() {
    if (this.airportForm.get('countryId')?.value === null || this.airportForm.get('countryId')?.value === "") {
      this.toastr.error('Please select country.');
    }
    if (this.airportForm.valid) {
      var airport: AirportCreateRM = this.airportForm.value;

      airport.lat = this.airportForm.value.latitudeDirection.toLowerCase() == "south"
        ? this.airportForm.value.lat * -1
        : Number(this.airportForm.value.lat);

      airport.lon = this.airportForm.value.longitudeDirection.toLowerCase() == "west"
        ? this.airportForm.value.lon * -1
        : Number(this.airportForm.value.lon);

      this.airportService.create(airport).subscribe({
        next: (res) => {
          this.toastr.success('Successfully create airport.');
          this.submitSuccess.emit();
          this.closeModal();
        },
        error: (err) => {
          this.toastr.error('Unable to create airport.');
        }
      })
    } else {
      this.airportForm.markAllAsTouched();
    }
  }

  closeModal() {
    this.airportForm.reset();
    this.closePopup.emit();
  }

}
