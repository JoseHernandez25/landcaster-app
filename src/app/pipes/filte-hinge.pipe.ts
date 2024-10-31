import { Pipe, PipeTransform } from '@angular/core';
import { HingeComponent } from '../interfaces/models/hingeComponent.interface';

@Pipe({
  name: 'filterHingeType',
  standalone: true,
})
// export class FilterHingeTypePipe implements PipeTransform {
//   transform(hingeComponents: HingeComponent[], args?: any): any {
//     if (!hingeComponents) return null;
//     if (!args) return hingeComponents;

//     args = args.toLowerCase();
//     return hingeComponents.filter((hingeComponent) => {
//       return JSON.stringify(hingeComponent).toLowerCase().includes(args);
//     });
//   }
// }
export class FilterHingeTypePipe implements PipeTransform {
  transform(hingeComponents: HingeComponent[], searchText: string): HingeComponent[] {
    if (!hingeComponents || !searchText) {
      return hingeComponents;
    }
    
    const searchTerm = searchText.toLowerCase();
    
    return hingeComponents.filter(component =>
      component.code.toLowerCase().includes(searchTerm)
    );
    
  }
  
  
}