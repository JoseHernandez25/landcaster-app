import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculatePrice',
  standalone: true
})
export class CalculatePricePipe implements PipeTransform {

  public increaseFactorGlobal: number = 1.35;
  public finalPrice: number = 0;

  transform(increaseFactor: number, prices: number[]): number {
    
    if (this.increaseFactorGlobal == increaseFactor) {
      const price = prices.reduce((total, price) => total + price, 0);
      this.finalPrice =  price * this.increaseFactorGlobal;
    }else{
      const price = prices.reduce((total, price) => total + price, 0);
      this.finalPrice =  price * increaseFactor;
    }
    return this.finalPrice;
  }

}
