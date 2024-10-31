import { Component, Input, inject, ViewChild, Output, EventEmitter } from '@angular/core';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { MaterialsTypesComponent } from '../../components/materials-types/materials-types.component';
import { SubtypematerialsComponent } from '../../components/subtypematerials/subtypematerials.component';
import { MaterialSectionComponent } from '../../components/material-section/material-section.component';



@Component({
  selector: 'app-materials',
  standalone: true,
  imports: [PaginationComponent, CommonModule, MaterialsTypesComponent, SubtypematerialsComponent,MaterialSectionComponent],
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.scss'
})
export default class MaterialsComponent {
  boolmaterial:boolean = false;
  boolsubtypematerial: boolean = false; // Controla la visibilidad del componente de subclases de materiales
  booltypematerial: boolean = true;
  isMaterialTabSelected: boolean = true;
  materialTypeName: string = ""; //utilizo para seleccionarlo
  subTypeMaterialName: string = "";
  materialName: string = "";
  public term: string= '';
  @ViewChild('materialsTypes') materialTypes!: MaterialsTypesComponent;
  @ViewChild('subtypematerials') subtypeMaterials!: SubtypematerialsComponent;
  @ViewChild('materials') materials!: MaterialSectionComponent;
  

  search(event: any) {
    let term = event.target.value
    if (this.booltypematerial) {
      this.materialTypes.search(term);
    } 
    if (this.boolsubtypematerial) {
      this.subtypeMaterials.search(term);
    }
    if (this.boolmaterial) {
      this.materials.search(term); 
    } 
  }
  
  

  getSubTypeMaterials() {
    this.boolsubtypematerial = true;
    this.booltypematerial = false;
    this.boolmaterial = false;
    
    this.materialTypeName = '';
    this.subTypeMaterialName = '';
    this.materialName = '';
  }

  getTypeMaterials() {
    this.boolsubtypematerial = false;
    this.booltypematerial = true;
    this.boolmaterial= false;
   
    this.materialTypeName = ''; // Reiniciar el valor de la variable de la pestaña de bisagras
    this.subTypeMaterialName = '';
    this.materialName = '';

  }

  getMaterial(){
    this.boolsubtypematerial = false;
    this.booltypematerial = false;
    this.boolmaterial = true;
    
    this.materialTypeName = ''; // Reiniciar el valor de la variable de la pestaña de bisagras
    this.subTypeMaterialName = '';
    this.materialName = '';
  }

  selectMaterialType(materialTypeName: string) {
    this.materialTypeName = materialTypeName; //utilizo para seleccionarlo
  }

  selectSubTypeMaterial(subTypeMaterialName: string) {
    console.log("llamando");
    this.subTypeMaterialName = subTypeMaterialName; //utilizo para seleccionarlo
  }

  selectMaterial(materialName: string) {
    console.log("llamando");
    this.materialName = materialName; //utilizo para seleccionarlo
  }


}
