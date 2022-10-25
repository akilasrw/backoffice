import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { AwbNumberStackService } from 'src/app/_services/awb-number-stack.service';
import { CargoAgentService } from 'src/app/_services/cargo-agent.service';

@Component({
  selector: 'app-awb-number-create',
  templateUrl: './awb-number-create.component.html',
  styleUrls: ['./awb-number-create.component.scss']
})
export class AwbNumberCreateComponent implements OnInit {

  keyword = 'value';
  cargoAgents: SelectList[] = [];
  isLoading :boolean= false;
  awbForm!:FormGroup;
  @Output() submitSuccess = new EventEmitter<any>();
  
  constructor(
    private awbSerice: AwbNumberStackService,
    private toastr: ToastrService,
    private cargoAgentService: CargoAgentService
  ) { }

  ngOnInit(): void {
    this. initAWBForm();
    this.loadCargoAgents();
  }

  loadCargoAgents() {
    this.isLoading=true;
    this.cargoAgentService.getAgentList()
      .subscribe({
        next: (res) => {
          if (res.length > 0) {
            this.cargoAgents = res;
          }
          this.isLoading=false;
        },
        error: (error) => {
          this.isLoading=false;
        }
      }
      );
  }

  selectedCargoAgent(value: any) {
    this.awbForm.get('cargoAgentId')?.patchValue(value.id);
  }

  initAWBForm() {
    this.awbForm = new FormGroup({
      cargoAgentId: new FormControl(null, [Validators.required]),
      aWBTrackingNumber: new FormControl(null, [Validators.required,Validators.minLength(11), Validators.maxLength(11)]),
    });
  }

  addAWBNumber(){
    if (this.awbForm.get('cargoAgentId')?.value === null || this.awbForm.get('cargoAgentId')?.value === "") {
      this.toastr.error('Please select booking agent.');
    }

    if(this.awbForm.valid){
      this.isLoading=true;
      this.awbSerice.create(this.awbForm.value).subscribe({
        next: (res) => {
          this.awbForm.markAsUntouched();
          this.awbForm.get('aWBTrackingNumber')?.patchValue(null);
          this.submitSuccess.emit();
          this.isLoading=false;
          this.toastr.success('AWB number added successfully.');
        },
        error: (error) => {
          this.isLoading=false;
        }
      });
    }else{
      this.awbForm.markAsTouched();
    }
  }
  
  onClearCargoAgent(){
    this.awbForm.get('cargoAgentId')?.patchValue(null);
  }


}
