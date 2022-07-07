import { AircraftSubType } from './../../../_models/view-models/aircrafts/aircraft-sub-type.model';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { Aircraft } from './../../../_models/view-models/aircrafts/aircraft.model';
import { AircraftFilterQuery } from './../../../_models/queries/aircraft/aircraft-filter-query.model';
import { AircraftActiveTypes } from './../../../core/enums/common-enums';
import { AircraftService } from './../../../_services/aircraft.service';
import { Component, OnInit } from '@angular/core';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-aircraft-list',
  templateUrl: './aircraft-list.component.html',
  styleUrls: ['./aircraft-list.component.scss']
})
export class AircraftListComponent implements OnInit {

  regNumber?: string;
  selectedAircraftType?: number;
  selectedActiveType?: number;
  totalCount: number = 0;
  modalVisible = false;
  modalVisibleAnimate = false;
  layoutModalVisible = false;
  layoutModalVisibleAnimate = false;
  detailsModalVisible = false;
  detailsModalVisibleAnimate = false;
  aircraftTypes?: SelectList[] = [];
  activeTypes: SelectList[] = [];
  subscription?: Subscription;
  selectedAircraftSubType?: AircraftSubType;
  aircrafts: Aircraft[] = [];
  selectedEditAircraft?: Aircraft;
  filterFormHasValue = false;
  selectedAircraftId?:string;
  aircraftFilterQuery: AircraftFilterQuery = new AircraftFilterQuery();
  keyword = 'value';


  constructor(private aircraftService: AircraftService) { }

  ngOnInit(): void {
    this.getAircraftTypes();
    this.loadActiveTypes();
    this.getAircraftList();
  }

  getAircraftList() {
    this.aircraftFilterQuery.regNo = this.regNumber;
    this.aircraftFilterQuery.aircraftType = this.selectedAircraftType;
    this.aircraftFilterQuery.activeType = this.selectedActiveType;
    this.aircraftService.getFilteredList(this.aircraftFilterQuery).subscribe(
      {
        next: (res) => {
          this.aircrafts = res.data
          this.totalCount = res.count
        },
        error: (error) => {
          this.totalCount = 0;
          this.aircrafts = []
        }
      }
    )
  }

  getAircraftTypes() {
    this.aircraftService.getAircraftTypes().subscribe({
      next: (res) => {
        this.getFileredAircraftTypes();
      },
      error: (err) => {

      }
    });
  }

  getFileredAircraftTypes() {
    this.subscription = this.aircraftService.aircraftTypes$.subscribe(res => {
      if (res != null) {
        res.forEach(obj => {
          this.aircraftTypes?.push({ id: obj.type?.toString(), value: obj.name });
        });
      }
    });
  }

  loadActiveTypes() {
    this.activeTypes.push({ id: AircraftActiveTypes.None.toString(), value: 'All' },
      { id: AircraftActiveTypes.Active.toString(), value: CoreExtensions.GetAircraftActiveStaus(AircraftActiveTypes.Active) },
      { id: AircraftActiveTypes.Inactive.toString(), value: CoreExtensions.GetAircraftActiveStaus(AircraftActiveTypes.Inactive) });
  }

  selectedAircraft(value: any) {
    this.selectedAircraftType = Number(value.id);
  }

  onClearAircraft() {
    this.selectedAircraftType = undefined;
  }

  selectedActive(value: any) {
    this.selectedActiveType = Number(value.id);
  }

  onClearActive() {
    this.selectedActiveType = undefined;
  }

  onChangeFilterFrm(event: any) {
    if (this.regNumber !== undefined && this.regNumber !== "") {
      this.filterFormHasValue = true;
    } else {
      this.filterFormHasValue = false;
    }
  }

  clearFilter() {
    this.regNumber = undefined;
    this.onClearActive();
    this.onClearAircraft();
    this.filterFormHasValue = false;
  }

  GetAircraftType(type: number) {
    return CoreExtensions.GetAircraftType(type);
  }

  GetAircraftConfigType(type: number) {
    return CoreExtensions.GetAircraftConfigType(type);
  }

  GetAircraftStaus(type: number) {
    return CoreExtensions.GetAircraftStaus(type);
  }

  onAircraftAdd() {
    this.getAircraftList();
  }

  addAircraft() {
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  closeAddAircraft() {
    this.selectedEditAircraft = undefined;
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  viewLayout(model: AircraftSubType) {
    this.selectedAircraftSubType = model;
    this.layoutModalVisible = true;
    setTimeout(() => (this.layoutModalVisibleAnimate = true));
  }

  closeAddLayout() {
    this.layoutModalVisibleAnimate = false;
    setTimeout(() => (this.layoutModalVisible = false), 300);
  }

  onEditAircraft(item: any) {
    this.selectedEditAircraft = item;
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  viewAircraftDetails(id:string) {
    this.selectedAircraftId = id;
    this.detailsModalVisible = true;
    setTimeout(() => (this.detailsModalVisibleAnimate = true));
  }

  closeAircraftDetails() {
    this.detailsModalVisibleAnimate = false;
    setTimeout(() => (this.detailsModalVisible = false), 300);
  }


}
