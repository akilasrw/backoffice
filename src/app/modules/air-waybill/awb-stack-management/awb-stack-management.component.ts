import { CargoAgentService } from './../../../_services/cargo-agent.service';
import { AwbService } from './../../../_services/awb.service';
import { AWBStack } from './../../../_models/view-models/awb/awb-stack.model';
import { Component, OnInit } from '@angular/core';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-awb-stack-management',
  templateUrl: './awb-stack-management.component.html',
  styleUrls: ['./awb-stack-management.component.scss']
})
export class AwbStackManagementComponent implements OnInit {

  keyword = 'value';
  cargoAgents: SelectList[] = [];
  lastAWBStack?: AWBStack;
  cargoAgentId?: string;


  
  constructor(
    private awbSerice:AwbService,
    private toastr: ToastrService,
    private cargoAgentService:CargoAgentService
  ) { }

  ngOnInit(): void {
    this.loadCargoAgents();
    this.getLastAWBStack();
  }

  loadCargoAgents(){
    this.cargoAgentService.getAgentList()
    .subscribe({
      next:(res)=>{
        if (res.length > 0) {
          this.cargoAgents = res;
        }},
        error:(error)=>{

        } 
    }
    );
  }

  getLastAWBStack(){
    this.awbSerice.getLastStackItem()
    .subscribe(
      {
        next:(res)=>{
          this.lastAWBStack = res;
        },
        error:(error)=>{
  
        } 
      }
    );
  }

  selectedCargoAgent(value: any) {
    this.cargoAgentId = value.id;
  }

}
