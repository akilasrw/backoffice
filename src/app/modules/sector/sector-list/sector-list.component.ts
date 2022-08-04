import { AirportService } from 'src/app/_services/airport.service';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { SectorService } from './../../../_services/sector.service';
import { Component, OnInit } from '@angular/core';
import { Sector } from 'src/app/_models/view-models/sector/sector.model';
import { SectorFilterQuery } from 'src/app/_models/queries/sector/sector-filter-query.model';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { SectorType } from 'src/app/core/enums/common-enums';
import { ToastrService } from 'ngx-toastr';
import { CommonMessages } from 'src/app/core/constants/common-messages';

@Component({
  selector: 'app-sector-list',
  templateUrl: './sector-list.component.html',
  styleUrls: ['./sector-list.component.scss']
})
export class SectorListComponent implements OnInit {

  modalVisible = false;
  modalVisibleAnimate = false;
  sectors: Sector[] = [];
  originAirpots: SelectList[] = [];
  destinationAirpots: SelectList[] = [];
  sectorTypes: SelectList[] = [];
  totalCount: number = 0;
  sectorFilterQuery: SectorFilterQuery = new SectorFilterQuery();
  sectorType?: number;
  originAirportId?: string;
  destinationAirportId?: string;
  selectedDeletedID?:string;
  modalVisibleDelete = false;
  modalVisibleAnimateDelete = false;
  selectedSector?:Sector;
  isLoading :boolean= false;
  keyword = 'value';

  constructor(private sectorService : SectorService,private airportService: AirportService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadAirports();
    this.loadSectorTypes();
    this.getSectorList();
  }

  loadSectorTypes(){
    this.sectorTypes.push({id:'1',value:CoreExtensions.GetSectorType(SectorType.Domestic)},{id:'2',value:CoreExtensions.GetSectorType(SectorType.International)});
  }

  loadAirports() {
    this.isLoading=true;
    this.airportService.getSelectList()
      .subscribe(res => {
        if (res.length > 0) {
          this.originAirpots = res;
          Object.assign(this.destinationAirpots, res);
        }
        this.isLoading=false;
      });
  }

  getSectorList() {
    this.isLoading=true;
    this.sectorFilterQuery.sectorType = this.sectorType;
    this.sectorFilterQuery.originAirportId = this.originAirportId;
    this.sectorFilterQuery.destinationAirportId = this.destinationAirportId;
    this.sectorService.getFilteredList(this.sectorFilterQuery).subscribe(
      {
        next: (res) => {
          this.sectors = res.data;
          this.totalCount = res.count;
          this.isLoading=false;
        },
        error: (error) => {
          this.totalCount = 0;
          this.sectors = [];
          this.isLoading=false;
        }
      }
    );
  }

  onEdit(sector:Sector){
    this.selectedSector = sector;
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  onDelete(id:string){
    this.selectedDeletedID = id;
    this.modalVisibleDelete = true;
    setTimeout(() => (this.modalVisibleAnimateDelete = true));
  }

  cancelDelete() {
    this.selectedDeletedID = '';
    this.modalVisibleAnimateDelete = false;
    setTimeout(() => (this.modalVisibleDelete = false), 300);
  }

  deleteSector() {
    if (this.selectedDeletedID) {
      this.isLoading=true;
      this.sectorService.deleteSector(this.selectedDeletedID)
        .subscribe({
          next: (res) => {
            this.toastr.success(CommonMessages.DeletedSuccessMsg);
            this.cancelDelete();
            this.sectors = [];
            this.isLoading=false;
            this.getSectorList();
          },
          error: (error) => {
            this.toastr.error(CommonMessages.DeleteFailMsg);
            this.cancelDelete();
            this.isLoading=false;
          }
        });
    }
  }

  selectedSectorType(value: any){
    this.sectorType = Number(value.id);
  }

  onClearSectorType(){
    this.sectorType = undefined;
  }

  selectedOrigin(value: any) {
    this.originAirportId = value.id;
  }

  onClearOrigin(){
    this.originAirportId = undefined;
  }

  selectedDestination(value: any) {
    this.destinationAirportId = value.id;
  }

  onClearDestination(){
    this.destinationAirportId = undefined;
  }

  GetSectorType(type:number){
    return CoreExtensions.GetSectorType(type);
  }

  closeAddSector() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  addSector() {
    this.selectedSector = undefined;
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  onSectorAdd() {
    this.getSectorList();
  }
 
}
