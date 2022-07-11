import { SelectList } from './../../../shared/models/select-list.model';
import { CountryService } from './../../../_services/country.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AirportCreateRM } from 'src/app/_models/request-models/airport/airport-create-rm';
import { AirportService } from 'src/app/_services/airport.service';
import { Airport } from 'src/app/_models/view-models/airports/airport.model';
import { AirportUpdateRM } from 'src/app/_models/request-models/airport/airport-update-rm';

@Component({
  selector: 'app-airport-create',
  templateUrl: './airport-create.component.html',
  styleUrls: ['./airport-create.component.scss']
})
export class AirportCreateComponent implements OnInit {

  countryList: SelectList[] = [];
  editCountryIndex?: number;
  public airportForm!: FormGroup;
  keyword = 'value';
  @Output() closePopup = new EventEmitter<any>();
  @Output() submitSuccess = new EventEmitter<any>();
  @Input() airport: Airport = new Airport();
  isEditAirport: boolean = false;



  constructor(private countryService: CountryService,
    private airportService: AirportService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadCountries();
    this.initializeAirportForm();
    if (this.airport != null) {
      this.isEditAirport = true;
      this.editAirportForm(this.airport);
    }
  }

  initializeAirportForm() {
    this.airportForm = new FormGroup({
      id: new FormControl(null),
      countryId: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      code: new FormControl(null, [Validators.required, Validators.pattern("^[a-zA-Z]+$"), Validators.maxLength(3)]),
      lat: new FormControl(null, [Validators.required, Validators.pattern("^[0-9/./]*$")]),
      lon: new FormControl(null, [Validators.required, Validators.pattern("^[0-9/./]*$")]),
      latitudeDirection: new FormControl(null, [Validators.required]),
      longitudeDirection: new FormControl(null, [Validators.required]),
    });
  }

  editAirportForm(airport: Airport) {
    this.airportForm.get('id')?.patchValue(airport.id);
    this.airportForm.get('countryId')?.patchValue(airport.countryId);
    this.airportForm.get('name')?.patchValue(airport.name);
    this.airportForm.get('code')?.patchValue(airport.code);
    this.airportForm.get('lat')?.patchValue((airport.lat! < 0) ? airport.lat! * -1 : airport.lat);
    this.airportForm.get('lon')?.patchValue((airport.lon! < 0) ? airport.lon! * -1 : airport.lon);
    this.airportForm.get('latitudeDirection')?.patchValue((airport.lat! < 0) ? 'South' : 'North');
    this.airportForm.get('longitudeDirection')?.patchValue((airport.lon! < 0) ? 'West' : 'East');
  }

  loadCountries() {
    this.countryService.getCountryList()
      .subscribe(res => {
        if (res.length > 0) {
          this.countryList = res;
          if (this.isEditAirport) {
            this.editCountryIndex = this.countryList.findIndex(x => x.id == this.airport.countryId);
          }
        }
      });
  }

  selectedCountry(value: any) {
    this.airportForm.get('countryId')?.patchValue(value.id);
  }

  onClearCountry() {
    this.airportForm.get('countryId')?.patchValue(null);
  }

  saveAirportDetails() {
    if (this.airportForm.get('countryId')?.value === null || this.airportForm.get('countryId')?.value === "") {
      this.toastr.error('Please select country.');
    }
    if (this.airportForm.valid) {

      if (this.isEditAirport) {
        var editAirport: AirportUpdateRM = this.airportForm.value;

        editAirport.lat = this.airportForm.value.latitudeDirection.toLowerCase() == "south"
          ? this.airportForm.value.lat * -1
          : Number(this.airportForm.value.lat);

          editAirport.lon = this.airportForm.value.longitudeDirection.toLowerCase() == "west"
          ? this.airportForm.value.lon * -1
          : Number(this.airportForm.value.lon);

        this.airportService.update(editAirport).subscribe({
          next: (res) => {
            this.toastr.success('Airport updated successfully.');
            this.submitSuccess.emit();
            this.closeModal();
          },
          error: (err) => {
          }
        })
      } else {
        var airport: AirportCreateRM = this.airportForm.value;

        airport.lat = this.airportForm.value.latitudeDirection.toLowerCase() == "south"
          ? this.airportForm.value.lat * -1
          : Number(this.airportForm.value.lat);

        airport.lon = this.airportForm.value.longitudeDirection.toLowerCase() == "west"
          ? this.airportForm.value.lon * -1
          : Number(this.airportForm.value.lon);

        this.airportService.create(airport).subscribe({
          next: (res) => {
            this.toastr.success('Airport created successfully.');
            this.submitSuccess.emit();
            this.closeModal();
          },
          error: (err) => {
          }
        })
      }
    } else {
      this.airportForm.markAllAsTouched();
    }
  }

  closeModal() {
    this.airportForm.reset();
    this.closePopup.emit();
  }

}
