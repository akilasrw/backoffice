import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AgentOtherRatesType, CreateAgentOtherRate, MainRateType } from 'src/app/_models/view-models/rate/agent-rate';
import { OtherRateService } from 'src/app/_services/other-rate.service';
import { SelectList } from 'src/app/shared/models/select-list.model';

@Component({
  selector: 'app-other-charges-create',
  templateUrl: './other-charges-create.component.html',
  styleUrls: ['./other-charges-create.component.scss']
})
export class OtherChargesCreateComponent implements OnInit {
  otherChargesForm: FormGroup;
  @Output() closePopup = new EventEmitter<any>();
  mainCategories = [
    { value: 'Export Fees', id: MainRateType.ExportFees },
    { value: 'Import Fees', id: MainRateType.ImportFees },
    { value: 'Miscellaneous Fees', id: MainRateType.MiscellaneousFees }
  ];

  subCategories: SelectList[] = [];
  data:CreateAgentOtherRate = {} as CreateAgentOtherRate;
  
  childCategories: SelectList[] = [];
  categoryID:string = ''
  categoryName:string = ''

  keyword = 'value';

  

  onMainCategoryChange(e:any){
    console.log(e)
    this.otherRateService.GetSubCategories(e.id.toString()).subscribe((x)=>{
      this.subCategories = x.map((y)=> {
        return{
          id:y.id, value:y.categoryName
        }
      })
    })
  }

  onSubCategoryChange(e:any){
    console.log(e)
    this.otherRateService.GetChildCategories(e.id.toString()).subscribe((x)=>{
      this.childCategories = x.map((y)=> {
        return{
          id:y.id, value:y.categoryName
        }
      })
    })
  }
  onChildCategoryChange(e:any){
    this.categoryID = e.id
    this.categoryName = e.value
  }

  constructor(private fb: FormBuilder,private otherRateService: OtherRateService,private toastr: ToastrService,) { 
    this.otherChargesForm = this.fb.group({
      description: ['', Validators.required],
      rateDescription: ['', Validators.required],
      minimumPerceptionRate: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      ratePerKg: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      fixRate: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      perHourTranche: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      iataCode:  ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.otherChargesForm.valid) {
      const formValues = this.otherChargesForm.value;
      const newRate: CreateAgentOtherRate = {
        SubCategoryID: this.categoryID,
        rateName: this.categoryName,
        description: formValues.description,
        rateDescription: formValues.rateDescription,
        minPreceptionRate: formValues.minimumPerceptionRate,
        ratePerKG: formValues.ratePerKg,
        fixRate: formValues.fixRate,
        trancheRate: formValues.perHourTranche,
        iataCode: formValues.iataCode
      };

      this.otherRateService.createAgentOtherRates(newRate).subscribe((x)=>{
        this.toastr.success("Other rate created successfully")
        this.closePopup.emit()
      });
    } else {
      this.toastr.error("feilds invalid")
    }
  }

  onCancel(): void {
    this.otherChargesForm.reset();
  }
}
