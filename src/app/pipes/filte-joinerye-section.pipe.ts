import { Pipe, PipeTransform } from '@angular/core';
import { JoinerieType, Joinery } from '../interfaces/models/joinery.interface'; 

@Pipe({
  name: 'filterJoineryeSection',
  standalone: true,
})
export class FilterJoineryeSectionPipe implements PipeTransform {
  transform(joinerieType: JoinerieType[], args?: any): any {
    if (!joinerieType) return null;
    if (!args) return joinerieType;

    args = args.toLowerCase();
    return joinerieType.filter((joinerieType) => {
      return JSON.stringify(joinerieType).toLowerCase().includes(args);
    });
  }
}
