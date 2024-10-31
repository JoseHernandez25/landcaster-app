import { Pipe, PipeTransform } from '@angular/core';
import { MaterialType } from '../interfaces/models/color.interface';

@Pipe({
  name: 'filterSubtypeMaterial',
  standalone: true,
})
export class FilterSubtypeMaterialPipe implements PipeTransform {
  transform(materialTypes: MaterialType[], args?: any): any {
    if (!materialTypes) return null;
    if (!args) return materialTypes;

    args = args.toLowerCase();
    return materialTypes.filter((materialType) => {
      return JSON.stringify(materialType).toLowerCase().includes(args);
    });
  }
}
