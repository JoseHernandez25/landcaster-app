
import { Pipe, PipeTransform } from '@angular/core';
import { Model } from '../interfaces/models/model.interface'; 

@Pipe({
  name: 'filterModel',
  standalone: true,
})
export class FilterModelPipe implements PipeTransform {
    transform(model: Model[], args?: any): any {
      if (!model) return null;
      if (!args) return model;
  
      args = args.toLowerCase();
      return model.filter((model) => {
        return JSON.stringify(model).toLowerCase().includes(args);
      });
    }
  }