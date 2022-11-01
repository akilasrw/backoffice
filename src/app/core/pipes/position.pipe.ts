import { Pipe, PipeTransform } from '@angular/core';
import { CargoPositionDetail } from 'src/app/_models/view-models/booking-summary/cargo-position-detail.model';

@Pipe({
  name: 'position'
})
export class PositionPipe implements PipeTransform {

  transform(positions: CargoPositionDetail[]) {
    return positions.filter(x=> x.isPalletAssigned == true);
  }

}
