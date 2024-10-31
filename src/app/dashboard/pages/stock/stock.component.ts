import { Component, EventEmitter, Output, TemplateRef, ViewChild, ElementRef, inject } from '@angular/core';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsComponent } from '../../components/products/products.component'
import { InventoriesComponent } from '../../components/inventories/inventories.component';
@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [ReactiveFormsModule, ProductsComponent, InventoriesComponent, PaginationComponent, CommonModule, NgbModalModule],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss'
})
export default class StockComponent {
  public term: string = '';
  showinv:boolean =true;
  showpro:boolean =false;
  productName: string = "";
  inventoryName: string = "";

  @ViewChild('products') products!: ProductsComponent;
  @ViewChild('inventories') inventories!: InventoriesComponent;
  showInventories() {
    this.showinv = true;
    this.showpro = false;
  }
  showProducts() {
    this.showinv = false;
    this.showpro = true;
  }
  
  search(event: any) {
    console.log("Método search llamado");
    let term = event.target.value;
    if (this.showinv) {
      this.inventories.search(term);
    } if (this.showpro) {
      this.products.search(term);
      console.log("desde stock");
    }
  }

  selectProducts(productName: string) {
    this.productName = productName;   
  }
  
  selectInventories(inventoryName: string) {
    this.inventoryName = inventoryName;   
  }
}
