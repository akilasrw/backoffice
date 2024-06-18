import { Component, OnInit } from '@angular/core';
import { AgentOtherRatesType, ChildCategorytype, MainRateType, SubCategorytype } from 'src/app/_models/view-models/rate/agent-rate';
import { OtherRateService } from 'src/app/_services/other-rate.service';

@Component({
  selector: 'app-other-charges',
  templateUrl: './other-charges.component.html',
  styleUrls: ['./other-charges.component.scss']
})
export class OtherChargesComponent implements OnInit {

  addRatemodalVisible = false;
  addRateModalVisibleAnimate = false;
  rateDetailModalVisible = false;
  rateDetailModalVisibleAnimate = false;
  rateUpdateModalVisible = false;
  rateUpdateModalVisibleAnimate = false;
  agentOtherRates:AgentOtherRatesType[]  =  [] 

  selectedMainCategory:MainRateType = MainRateType.ExportFees;
  selectedSubCategory: string | null = null;
  selectedChildCategory: string | null = null;

  mainCategories = [
    { categoryName: 'Export Fees', categoryType: MainRateType.ExportFees, id: 'exportFees' },
    { categoryName: 'Import Fees', categoryType: MainRateType.ImportFees, id: 'importFees' },
    { categoryName: 'Miscellaneous Fees', categoryType: MainRateType.MiscellaneousFees, id: 'miscellaneousFees' }
  ];

  subCategories: SubCategorytype[] = [];

  childCategories: ChildCategorytype[] = [];

  constructor(private otherRateService: OtherRateService,) { }

  ngOnInit(): void {
    this.onMainCategoryChange()
    this.onSubCategoryChange()
  }

 
  openAddRate() {
    this.addRatemodalVisible = true;
    setTimeout(() => (this.addRateModalVisibleAnimate = true));
  }

  onMainCategoryChange(){
    console.log(this.selectedMainCategory)
    this.otherRateService.GetSubCategories(this.selectedMainCategory.toString()).subscribe((x)=>{
      this.subCategories = x
    })
  }

  onSubCategoryChange(){
    console.log(this.selectedSubCategory)
    if(this.selectedSubCategory){
      this.otherRateService.GetChildCategories(this.selectedSubCategory.toString()).subscribe((x)=>{
        this.childCategories = x
      })
    }
    
  }

  onChildCategoryChange(){
    console.log(this.selectedChildCategory)
    if(this.selectedChildCategory){
      this.otherRateService.GetAgentOtherRates(this.selectedChildCategory.toString()).subscribe((x)=>{
        this.agentOtherRates = x
      })
    }
    
  }

  closeAddRate() {
    this.addRateModalVisibleAnimate = false;
    setTimeout(() => (this.addRatemodalVisible = false), 300);
  }

  onUpdate() { // rateId: string
    //this.selectedRateId = rateId;
    this.rateUpdateModalVisible = true;
    setTimeout(() => (this.rateUpdateModalVisibleAnimate = true));
  }

  closeRateUpdate() {
    this.rateUpdateModalVisibleAnimate = false;
    setTimeout(() => (this.rateUpdateModalVisible = false), 300);
  }

  getSubCategories(mainCategory: MainRateType) {
    console.log(this.selectedSubCategory)
    return this.subCategories.filter(subCategory => subCategory.categoryType === mainCategory);
  }

}
