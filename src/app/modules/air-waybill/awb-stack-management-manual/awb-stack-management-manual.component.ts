import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { AwbService } from 'src/app/_services/awb.service';
import { CargoAgentService } from 'src/app/_services/cargo-agent.service';

@Component({
  selector: 'app-awb-stack-management-manual',
  templateUrl: './awb-stack-management-manual.component.html',
  styleUrls: ['./awb-stack-management-manual.component.scss']
})
export class AwbStackManagementManualComponent implements OnInit {

  keyword = 'value';
  cargoAgents: SelectList[] = [];
  isLoading :boolean= false;
  cargoAgentId?: string;
  awbForm!:FormGroup;
  
  constructor(
    private awbSerice: AwbService,
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
    this.cargoAgentId = value.id;
  }

  initAWBForm() {
    this.awbForm = new FormGroup({
      cargoAgentId: new FormControl(null, [Validators.required]),
      awbNumber: new FormControl(null, [Validators.required,Validators.minLength(11), Validators.maxLength(11)]),
    });
  }

  addAWBNumber(){
    
  }
}
