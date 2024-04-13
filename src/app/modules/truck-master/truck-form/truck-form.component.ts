import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-truck-form',
  templateUrl: './truck-form.component.html',
  styleUrls: ['./truck-form.component.scss']
})
export class TruckFormComponent implements OnInit {

  isLoading: boolean = false;
  @Output() closePopup = new EventEmitter<any>();
  public truckForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.truckForm = this.fb.group({
      truckNumber: ['', Validators.required],
      lastUsedAgent: ['', Validators.required],
      lastUsedAWB: ['', Validators.required],
      lastTransportPackageCount: ['', Validators.required]
    });
  }

  closeModal() {
    this.truckForm.reset();
    this.closePopup.emit();
  }

}
