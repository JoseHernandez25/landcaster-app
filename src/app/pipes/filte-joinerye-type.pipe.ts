import { Pipe, PipeTransform } from '@angular/core';
import { JoinerieType, Joinery } from '../interfaces/models/joinery.interface'; 

@Pipe({
  name: 'filterJoineryeType',
  standalone: true,
})
export class FilterJoineryeTypePipe implements PipeTransform {
  transform(joinery: Joinery[], args?: any): any {
    if (!joinery) return null;
    if (!args) return joinery;

    args = args.toLowerCase();
    return joinery.filter((joinery) => {
      return JSON.stringify(joinery).toLowerCase().includes(args);
    });
  }
}
