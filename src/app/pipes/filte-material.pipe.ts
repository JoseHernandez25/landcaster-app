
import { Pipe, PipeTransform } from '@angular/core';
import { Material } from '../interfaces/models/material.interface'; 

@Pipe({
  name: 'filterMaterial',
  standalone: true,
})
export class FilterMaterialPipe implements PipeTransform {
    transform(material: Material[], args?: any): any {
      if (!material) return null;
      if (!args) return material;
  
      args = args.toLowerCase();
      return material.filter((material) => {
        return JSON.stringify(material).toLowerCase().includes(args);
      });
    }
  }