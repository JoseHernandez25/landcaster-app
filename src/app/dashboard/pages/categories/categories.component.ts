import { SubSubCategoriesComponent } from '../../components/sub-sub-categories/sub-sub-categories.component';
import { Component, Input, inject, ViewChild } from '@angular/core';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { SubCategoriesComponent } from '../../components/sub-categories/sub-categories.component';
import { CategoriesTabComponent } from '../../components/categories/categories-tab.component'
import { ProductsComponent } from '../../components/products/products.component'


@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [PaginationComponent, CommonModule, CategoriesTabComponent, SubCategoriesComponent, SubSubCategoriesComponent, ProductsComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export default class CategoriesComponent {
  catv:boolean =true;
  subcatv:boolean = false;
  subsubcatv:boolean = false;
  iscategoriesselected:boolean = true;
  showpro:boolean =false;
  categoryName: string = ""; //utilizo para seleccionarlo
  subCategoryName: string ="";
  subSubCategoryName: string ="";
  productName: string = "";
  public term: string = '';
  @ViewChild('categories') categoriesTab!: CategoriesTabComponent;
  @ViewChild('subcategories') subCategories!: SubCategoriesComponent;
  @ViewChild('subsubcategories') subSubCategories!: SubSubCategoriesComponent;
  @ViewChild('products') products!: ProductsComponent;
  search(event: any) {
    console.log("Método search llamado");
    let term = event.target.value;
    if (this.catv) {
      this.categoriesTab.search(term);
    } if (this.subcatv) {
      this.subCategories.search(term);
    } if (this.subsubcatv) {
      this.subSubCategories.search(term);
    } if (this.showpro) {
      this.products.search(term);
    }}

  getCategories() {
    this.catv = true;
    this.subcatv = false;
    this.subsubcatv = false;
    this.categoryName="";
    this.subCategoryName="";
    this.subSubCategoryName="";
    this.productName="";
  }

  getSubCategories() {
    this.catv = false;
    this.subcatv = true;
    this.subsubcatv = false;
    this.subCategoryName="";
    this.categoryName="";
    this.subSubCategoryName="";
    this.productName="";
  }

  getSubSubCategories() {
    this.subsubcatv = true;
    this.catv = false;
    this.subcatv = false;
    this.subSubCategoryName="";
    this.categoryName="";
    this.subCategoryName="";
    this.productName="";
  }

  showProducts() {
    this.catv = false;
    this.subcatv = false;
    this.subsubcatv = false;
    this.showpro = true;
    this.subSubCategoryName="";
    this.categoryName="";
    this.subCategoryName="";
    this.productName="";
  }
  selectCategories(categoryName: string) {
    this.categoryName = categoryName;   
  }

  selectSubCategories(SubCategoryName: string) {
    this.subCategoryName = SubCategoryName; 
  }
  
  selectSubSubCategories(SubSubCategoryName: string) {
    this.subSubCategoryName = SubSubCategoryName; 
  }

  selectProducts(productName: string) {
    this.productName = productName;   
  }
  }
  

