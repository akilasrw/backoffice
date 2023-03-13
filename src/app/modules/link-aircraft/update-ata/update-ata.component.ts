import { Component, EventEmitter, Input,  OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UpdateAtaRm } from 'src/app/_models/request-models/link-aircraft/update-ata-rm.model';
import { FlightScheduleService } from 'src/app/_services/flight-schedule.service';

@Component({
  selector: 'app-update-ata',
  templateUrl: './update-ata.component.html',
  styleUrls: ['./update-ata.component.scss']
})
export class UpdateATAComponent implements OnInit {

  ataForm!: FormGroup;
  selectedFlightScheduleId!: string;
  isLoading: boolean = false;
  @Input() set flightScheduleId(val: string) {
    this.selectedFlightScheduleId = val;
    this.initializeForm();
  }
  @Output() closePopup = new EventEmitter<any>();
  @Output() submitSuccess = new EventEmitter<any>();

  constructor(private flightScheduleService: FlightScheduleService,
    private toastr: ToastrService) { }

  ngOnInit(): void {

  }

  initializeForm() {
    this.ataForm = new FormGroup({
      id: new FormControl(this.selectedFlightScheduleId),
      actualArrivalDateTime: new FormControl(null, [Validators.required, Validators.min(0)]),
    });
  }

  saveATA() {
    if(this.ataForm.valid) { 
      this.isLoading = true;
      console.log(this.ataForm.value);

      var rm: UpdateAtaRm = new UpdateAtaRm();
      rm.id = this.selectedFlightScheduleId;
      rm.actualArrivalDateTime = this.ataForm.value.actualArrivalDateTime;
      this.flightScheduleService.updateATA(rm)
      .subscribe({
        next: (res) => {
          this.toastr.success('Updated successfully.');
          this.submitSuccess.emit();
          this.closeModal();
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
        }
        })

    } else {
      this.ataForm.markAllAsTouched();
    }
  }

  closeModal() {
    this.ataForm.reset();
    this.closePopup.emit();
  }
}
