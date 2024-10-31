import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
  standalone: true
})
export class OrderByPipe implements PipeTransform {

  transform(array: any[], field: string): any[] {
    if (!Array.isArray(array) || !field) {
      return array;
    }

    return array.sort((a, b) => {
      if (a[field] < b[field]) {
        return -1;  // Orden ascendente
      }
      if (a[field] > b[field]) {
        return 1; // Orden ascendente
      }
      return 0;
    });
  }
}
