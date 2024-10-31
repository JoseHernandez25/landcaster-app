import { Pipe, PipeTransform } from '@angular/core';
import { TypesBoxJourney } from '../interfaces/models/TypesBoxJounery';
@Pipe({
    name: 'filterTypeBoxJounery',
    standalone: true,
  })
  export class FilterTypeBoxJourneyPipe implements PipeTransform {
    transform(typeBoxJourney: TypesBoxJourney[], searchText: string): TypesBoxJourney[] {
      if (!typeBoxJourney || !searchText) {
        return typeBoxJourney;
      }
      
      const searchTerm = searchText.toLowerCase();
      
      return typeBoxJourney.filter(typeBoxJourney =>
        typeBoxJourney.name.toLowerCase().includes(searchTerm)
      );
      
    }
    
    
  }