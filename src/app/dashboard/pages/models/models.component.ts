import { Component, Input, inject, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { MaterialsTypesComponent } from '../../components/materials-types/materials-types.component';
import { SubtypematerialsComponent } from '../../components/subtypematerials/subtypematerials.component';
import { MaterialSectionComponent } from '../../components/material-section/material-section.component';
import { ModelSectionComponent } from '../../components/model-section/model-section.component';
import { DoorModelComponent } from '../../components/door-model/door-model.component';
import { PaginateParameters } from '../../../interfaces/pagination.interface';
import { DoorModelsService } from '../../services/door-models.service';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { ModelsService } from '../../services/models.service';
import { MaterialtypesService } from '../../services/materialtypes.service';
import { JoineryService } from '../../services/joinery.service';

@Component({
  selector: 'app-models',
  standalone: true,
  imports: [PaginationComponent, CommonModule,ModelSectionComponent,DoorModelComponent],
  templateUrl: './models.component.html',
  styleUrl: './models.component.scss'
})
export default class ModelsComponent {
  public materialType: any[] = [];
  public model: any[] = [];
  public joinery: any[] = [];
  public joineryType: any[] = [];
  public route: any[] = [];
  public line: any[] = [];
  boolmodel: boolean = false;
  public term: string= '';
  modelName: string = "";
  doormodelName: string ="";
  isModelTabSelected: boolean = true;
  public _doorModel = inject(DoorModelsService);
  public paginationService = inject(PaginationService);
  public _modelService = inject(ModelsService);
  public modelId: number | string = '';
  @ViewChild('modelSection') modelSection!: ModelSectionComponent;
  @ViewChild('doorModel') doorModel!: DoorModelComponent;
  @ViewChild('selectModelId') selectModelId!: ElementRef;
  @ViewChild(DoorModelsService) doorModelService!: DoorModelsService;
  
  constructor() { }

  ngOnInit(): void {
    // this.getHingesComponents();
    this.getMaterialType();
    this.getModel();
    this.getJoinery();
    this.getJoineryType();
    this.getRoute();
    this.getLine();
  
  }

  search(event: any) {
    // Obtener el término de búsqueda del evento
    let term = event.target.value;

    
    if (this.isModelTabSelected) {
      
      this.modelSection.search(term);
    } else {
      this.doorModel.search(term);
    }
  }
    filterByMaterialType(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    this.doorModel.filterMaterialType(value);
  }  

  filterByModel(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    this.doorModel.filterModel(value);
  }  
  filterByJoinery(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    this.doorModel.filterJoinery(value);
  }  
  filterByJoineryType(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    this.doorModel.filterJoineryType(value);
  } 
  filterByRoute(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    this.doorModel.filterRoute(value);
  } 
  filterByLine(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    this.doorModel.filterLine(value);
  } 
  
  

  showModel() {
    this.boolmodel = false;
    this.isModelTabSelected = true;
    this.modelName = ''; 
    this.doormodelName = '';

}

showDoorModel() {
  this.boolmodel = true;
  this.isModelTabSelected = false;
  this.doormodelName = '';
  this.modelName = '';
  

}

selectModel(modelName: string) {
  this.modelName = modelName; //utilizo para seleccionarlo
}

selectdoorModel(doormodelName: string) {
  this.doormodelName = doormodelName; //utilizo para seleccionarlo
}

getMaterialType() {
  this._doorModel.getMaterialType().subscribe({
    next: (materialType) => {
      console.log(materialType);
      this.materialType = materialType;
    },
    error: (err) => {
      console.log(err);
    },
  });
}
getModel() {
  this._doorModel.getModel().subscribe({
    next: (model) => {
      
      this.model = model;
    },
    error: (err) => {
      console.log(err);
    },
  });
}
getJoinery() {
  this._doorModel.getJoinery().subscribe({
    next: (joinery) => {
      
      this.joinery = joinery;
    },
    error: (err) => {
      console.log(err);
    },
  });
}
getJoineryType() {
  this._doorModel.getJoineryType().subscribe({
    next: (joineryType) => {
      this.joineryType = joineryType;
    },
    error: (err) => {
      console.log(err);
    },
  });
}
getRoute() {
  this._doorModel.getRoute().subscribe({
    next: (route) => {
      this.route = route;
    },
    error: (err) => {
      console.log(err);
    },
  });
}
getLine() {
  this._doorModel.getLine().subscribe({
    next: (line) => {
      this.line = line;
    },
    error: (err) => {
      console.log(err);
    },
  });
}


}
