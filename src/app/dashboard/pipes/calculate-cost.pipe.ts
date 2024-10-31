import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculateCost',
  standalone: true // Agrega esta línea para marcar el pipe como independiente
})
export class CalculateCostPipe implements PipeTransform {
  transform(prices: number[]): number {
        // Toma un argumento prices, que es un array de números (precios), y devuelve un número (el resultado de la transformación).
    return prices.reduce((total, price) => total + price, 0);
  }
}
