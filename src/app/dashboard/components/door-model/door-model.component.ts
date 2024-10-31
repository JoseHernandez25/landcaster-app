import {
  Component,
  EventEmitter,
  Output,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DoorModelsService } from '../../services/door-models.service';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ValidatorService } from '../../../services/validator.service';
import { ConfirmationModalService } from '../../../shared/services/confirmation-modal.service';
import { PaginateParameters } from '../../../interfaces/pagination.interface';
import { ModelsService } from '../../services/models.service';
import { DoorModel } from '../../../interfaces/models/doorModel.interface';
import {
  JoinerieType,
  Joinery,
} from '../../../interfaces/models/joinery.interface';
import { LinesService } from '../../services/lines.service';
import { RoutesService } from '../../services/routes.service';
import { JoineryTypeService } from '../../services/joinery-type.service';
import { MaterialService } from '../../services/material.service';
import { JoineryService } from '../../services/joinery.service';
import { FilterModelPipe } from '../../../pipes/filte-model.pipe';
import { FilterMaterialPipe } from '../../../pipes/filte-material.pipe';
import { FilterTypeBoxJourneyPipe } from '../../../pipes/filte-TypeBoxJounery.pipe';
import { Model } from '../../../interfaces/models/model.interface';
import { Material } from '../../../interfaces/models/material.interface';
import { TypesBoxJourneyService } from '../../services/types-box-journey.service';
import { TypesBoxJourney } from '../../../interfaces/models/TypesBoxJounery';


@Component({
  selector: 'app-door-model',
  standalone: true,
  imports: [
    PaginationComponent,
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    FilterModelPipe,
    FilterMaterialPipe,
    FilterTypeBoxJourneyPipe
  ],
  templateUrl: './door-model.component.html',
  styleUrl: './door-model.component.scss',
})
export class DoorModelComponent {
  @Output() doormodelName = new EventEmitter<string>();

  public isLoading: boolean = false;

  public term: string = '';

  public modelId: number | string = '';
  public lineId: number | string = '';
  public routeId: number | string = '';
  public joineryTypeId: number | string = '';
  public joineryId: number | string = '';
  public materialTypeId: number | string = '';
  doorModels: any[] = [];
  lines: any[] = [];
  typesBoxJournies: any[] = [];
  chosetypesBoxJournies: TypesBoxJourney[] = [];
  detaillTypesBoxJounery: any[] = []
  public selectedIndex: number = -1;
  selectedTypeBoxJourney: TypesBoxJourney | null = null;


  routes: any[] = [];
  joineryTypes: any[] = [];

  joinery: any[] = [];
  joineryDetail: any[] = [];

  selectedMaterialIndex = -1;
  selectedModelIndex = -1;
  materialType: any[] = [];

  public Modelterm: string = '';
  models: any[] = [];

  public selectedDoorModel: DoorModel | null = null;

  public _doorModelService = inject(DoorModelsService);
  public _lineService = inject(LinesService);
  public _routeService = inject(RoutesService);
  public _joineryTypeService = inject(JoineryTypeService);
  public _joineryService = inject(JoineryService);
  public paginationService = inject(PaginationService);
  private formBuilder = inject(FormBuilder);
  private modal = inject(NgbModal);
  private toastService = inject(ToastService);
  public validatorService = inject(ValidatorService);
  private confirmationModalService = inject(ConfirmationModalService);
  orderByField: string = '';
  // Variable para rastrear el estado de ordenación actual
  public orderByAsc: boolean = true;
  public withTrashed: any = null;
  public showList: boolean = false;
  public showListTypeBox: boolean = false;
 

  @ViewChild('modalStoreDoorModel', { static: true })
  modalStoreDoorModel!: TemplateRef<any>;
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  public paginateParameters: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'doormodel',
    params: {
      term: this.term,
      modelId: this.modelId,
      lineId: this.lineId,
      routeId: this.routeId,
      joineryId: this.joineryId,
      joineryTypeId: this.joineryTypeId,
      materialTypeId: this.materialTypeId,
      orderByAsc: this.orderByAsc,
      orderBy: this.orderByAsc,
      withTrashed: this.withTrashed,
    },
  };

  public paginateParametersLin: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'lines',
    params: {
      term: this.term,
      orderByAsc: this.orderByAsc,
      orderBy: this.orderByAsc,
      withTrashed: this.withTrashed,
    },
  };

  public paginateParametersRou: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'routes',
    params: {
      term: this.term,
      orderByAsc: this.orderByAsc,
      orderBy: this.orderByAsc,
      withTrashed: this.withTrashed,
    },
  };

  public paginateParametersJouineryT: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'joinerytypes',
    params: {
      term: this.term,
    },
  };
  
  public paginateParametersJoinery: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'joineries',
    params: {
      term: this.term,
    },
  };
  

  public formEditDoorModel: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    privateCatalog: [''],
    publicCatalog: [''],
    modelId: [''],
    modelName: [''],
    lineId: [''],
    routeId: [''],
    joineryId: [''],
    joineryTypeId: [''],
    materialTypeId: [''],
    typesBoxJourneyId: [[]]
  });

  public formStoreDoorModel: FormGroup = this.formBuilder.group({
    
    privateCatalog: [''],
    publicCatalog: [''],
    modelId: ['', [Validators.required]],
    modelName: [''],
    lineId: ['', [Validators.required]],
    routeId: ['', [Validators.required]],
    joineryId: ['', [Validators.required]],
    joineryTypeId: ['', [Validators.required]],
    materialTypeId: ['', [Validators.required]],
    typesBoxJourneyId: [[]]
  });
  handleDoubleClick(doormodel: DoorModel) {
    console.log(doormodel);
    this.formEditDoorModel.setValue({
      id: doormodel.id,
      publicCatalog: doormodel.publicCatalog,
      privateCatalog: doormodel.privateCatalog,
      modelId: doormodel.modelId,
      lineId: doormodel.lineId,
      routeId: doormodel.routeId,
      joineryId: doormodel.joineryId,
      joineryTypeId: doormodel.joineryTypeId,
      materialTypeId: doormodel.materialTypeId,
      typesBoxJourneyId: doormodel.typesBoxJournies,
      modelName: doormodel,
    });
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  openTypesBoxJourney(typesBoxJourney: TypesBoxJourney[]) {
    this.detaillTypesBoxJounery = typesBoxJourney;
    console.log( this.detaillTypesBoxJounery);
    
  }

  constructor() {}

  ngOnInit(): void {
    this.getDoorModels();
    this.paginationService.pagination$.subscribe({
      next: (value) => {
        console.log(value);

        this.doorModels = value.data;
      },
    });
    this.getModel();
    this.getMaterialType();
    this.getJoinery();
    this.getJoineryType();
    this.getRoute();
    this.getLine();
    this.getTypesBoxJounery();
  }
  
  get typesBoxJourneyId(): FormArray {
    return this.formStoreDoorModel.get('typesBoxJourneyId') as FormArray;
  }

  

  getTypesBoxJounery() {
    this._doorModelService.getTypesBoxJourney().subscribe({
      next: (typesBoxJournies) => {
        console.log(typesBoxJournies);
        this.typesBoxJournies = typesBoxJournies;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  orderBy(field: string) {
    // Si se hace clic en el mismo campo de ordenación, cambiar el estado de ordenación
    if (this.orderByField === field) {
      this.orderByAsc = !this.orderByAsc;
    } else {
      // Si se hace clic en un nuevo campo de ordenación, establecerlo como el nuevo campo de ordenación y ordenar de forma ascendente
      this.orderByField = field;
      this.orderByAsc = true;
    }

    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      orderByAsc: this.orderByAsc,
      orderBy: field,
    };
    this.getDoorModels();
  }

  selectdoorModel(doormodel: DoorModel) {
    this.selectedDoorModel = doormodel;
    this.doormodelName.emit(doormodel.model.name); //se utilizo para seleccionarlo
  }

  openStoreModal() {
    this.modal.open(this.modalStoreDoorModel, { size: 'lg' });
  }

  search(term: any) {
    this.term = term;
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      term: term,
    };

    this.getDoorModels();
  }

  navigateModelUp() {
    if (this.selectedModelIndex > 0) {
      this.selectedModelIndex--;
    }
  }

  navigateUp() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  /* navigateDown() {
    if (this.selectedIndex < this.models.length - 1) {
      this.selectedIndex++;
    }
  } */

  
  navigateModelDown() {
    if (
      this.filteredModels().length > 0 &&
      this.selectedModelIndex < this.filteredModels().length - 1
    ) {
      this.selectedModelIndex++;
    }
  }

  navigateDown() {
    if (this.selectedIndex < this.typesBoxJournies.length - 1) {
      this.selectedIndex++;
    }
  }
  selectHingeComponentFromKeyboard() {
    if (this.selectedIndex !== -1) {
      const selectTypeBoxJourney = this.typesBoxJournies[this.selectedIndex];
      this.selectTypeBoxJourney(selectTypeBoxJourney);
    }
  }

  selectTypeBoxJourney(typesBoxJourney: TypesBoxJourney) {
    // Verificar si el componente ya está en la lista de componentes seleccionados
    let existItem = this.typesBoxJournies.some(
      (mt) => mt.id == typesBoxJourney.id
    );
    // Si el componente ya existe en la lista, mostrar un mensaje de advertencia y salir
    if (existItem) {
      this.toastService.showToast({
        message: `El ${typesBoxJourney.name} ya existe.`,
        state: 'danger',
      });
      return;
    }
    this.selectedTypeBoxJourney = typesBoxJourney;
    this.showListTypeBox = false;
  }

  /* selectMaterialFromKeyboard() {
    if (this.selectedIndex !== -1) {
      const selectedMaterial = this.materials[this.selectedIndex];
      this.formStoreDoorModel.patchValue({
        materialId: selectedMaterial.id,
        materialName: selectedMaterial.name,
      });
      this.showListMaterial = false;
    }
  } */

  store() {
    this.isLoading = true;
    if (this.formStoreDoorModel.invalid) {
      this.isLoading = false;
      this.formStoreDoorModel.markAllAsTouched();
      return;
    }

    const privateCatalogValue = this.formStoreDoorModel.get('privateCatalog')?.value;
    const publicCatalogValue = this.formStoreDoorModel.get('publicCatalog')?.value;
    const lineIdValue = this.formStoreDoorModel.get('lineId')?.value;
    const routeIdValue = this.formStoreDoorModel.get('routeId')?.value;
    const joineryIdValue = this.formStoreDoorModel.get('joineryId')?.value;
    const joineryTypeIdValue = this.formStoreDoorModel.get('joineryTypeId')?.value;
    const materialTypeIdValue = this.formStoreDoorModel.get('materialTypeId')?.value;
    const modelIdValue = this.formStoreDoorModel.get('modelId')?.value;

    const requestBody = {
      doorModel: {
        privateCatalog: privateCatalogValue,
        publicCatalog: publicCatalogValue,
        materialTypeId: materialTypeIdValue,
        modelId: modelIdValue,
        lineId: lineIdValue,
        routeId: routeIdValue,
        joineryId: joineryIdValue,
        joineryTypeId: joineryTypeIdValue,
      },
      typesBoxJourneyIds: this.formStoreDoorModel.value.typesBoxJourneyId // Obtenemos los valores directamente del formulario
    };

    console.log('Request Body:', requestBody);

    this._doorModelService.store(requestBody).subscribe({
      next: (resp) => {
        console.log('Store response:', resp);

        this.modal.dismissAll(this.modalStoreDoorModel);
        this.toastService.showToast({
          message: `El Modelo se agregó exitosamente`,
          state: 'success',
        });
        this.isLoading = false; // Detener la carga después del éxito
      },
      error: (err) => {
        console.error('Error while storing:', err);
        this.isLoading = false; // Detener la carga después del error
      },
    }); 
}




  update() {
    this.isLoading = true;
    if (this.formEditDoorModel.invalid) {
      this.isLoading = false;
      this.formEditDoorModel.markAllAsTouched();
      return;
    }
    let formEditDoorModel = this.formEditDoorModel.value;
    if (this.selectedDoorModel) {
      this._doorModelService
        .update(this.selectedDoorModel.id, formEditDoorModel)
        .subscribe({
          next: (resp) => {
            this.getDoorModels();
            this.modal.dismissAll(this.modalContent);
            this.toastService.showToast({
              message: `El color ${resp.name} se actualizó exitosamente`,
              state: 'success',
            });
          },
          error(err) {},
        });
    }
  }

  delete() {
    const message = '¿Estás seguro de que deseas eliminar este registro?';
    this.confirmationModalService
      .openConfirmationModal(message)
      .then((confirmed) => {
        if (confirmed) {
          this.isLoading = true;
          if (this.selectedDoorModel) {
            this._doorModelService.delete(this.selectedDoorModel.id).subscribe({
              next: (resp) => {
                this.getDoorModels();
                this.selectedDoorModel = null;
                this.toastService.showToast({
                  message: `El modelo de puerta ${resp.name} se eliminó exitosamente`,
                  state: 'success',
                });
              },
              error(err) {},
            });
          }
        }
      });
  }

  getDoorModels() {
    this._doorModelService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        console.log(pagination);
        
        this.paginationService.pagination$.next(pagination);      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getModel() {
    this._doorModelService.getModel().subscribe({
      next: (models) => {
        this.models = models; // Asigna los modelos devueltos
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /* selectMaterial(material: Material) {
    this.formStoreDoorModel.patchValue({
      materialId: material.id,
      materialName: material.name,
    });
    this.showListMaterial = false;
  } */

    getLine() {
      this._doorModelService.getLine().subscribe({
        next: (line) => {
          this.lines = line;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }

    getRoute() {
      this._doorModelService.getRoute().subscribe({
        next: (route) => {
          this.routes = route;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }

  getJoineryType() {
      this._doorModelService.getJoineryType().subscribe({
        next: (joineryType) => {
          this.joineryTypes = joineryType;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }

    getJoinery() {
      this._doorModelService.getJoinery().subscribe({
        next: (joinery) => {
          this.joinery = joinery;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }

  getMaterialType() {
    this._doorModelService.getMaterialType().subscribe({
      next: (materialType) => {
        this.materialType = materialType;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /* getTypesBoxJounery() {
    this._doorModelService.getTypesBoxJourney().subscribe({
      next: (typesBoxJournies) => {
        console.log(typesBoxJournies)
        this.typesBoxJournies = typesBoxJournies;
      },
      error: (err) => {
        console.log(err);
      },
    });
  } */

  searchModel(event: any) {
    const searchTerm = event.target.value;
    this.Modelterm = searchTerm;
    this.selectedModelIndex = -1; // Reinicia el índice cuando cambie el término de búsqueda
    this.showList = searchTerm.length > 0; // Mostrar la lista si hay un término de búsqueda
    this.formStoreDoorModel.patchValue({
      modelId: '',
    });
  }
  searchText(e: any) {
    this.term = e.target.value;
    this.showListTypeBox = true;
  }



  selectModelFromKeyboard() {
    if (
      this.selectedModelIndex >= 0 &&
      this.selectedModelIndex < this.filteredModels().length
    ) {
      this.selectModel(this.filteredModels()[this.selectedModelIndex]);
    }
  }

  selectModel(model: Model) {
    this.formStoreDoorModel.controls['modelId'].setValue(model.id);
    this.formStoreDoorModel.controls['modelName'].setValue(model.name);
    this.showList = false; // Ocultar la lista cuando se selecciona un modelo
  }

  

  filteredModels(): Model[] {
    return new FilterModelPipe().transform(this.models, this.Modelterm);
  }
  filterMaterialType(materialType_id: any){
    this.paginateParameters.params ={
     ...this.paginateParameters.params,
     materialTypeId: materialType_id,
    };
    this.getDoorModels();
 }

 filterModel(model_id: any){
  this.paginateParameters.params ={
   ...this.paginateParameters.params,
   modelId: model_id,
  };
  this.getDoorModels();
}

filterJoinery(joinery_id: any){
  this.paginateParameters.params ={
   ...this.paginateParameters.params,
   joineryId: joinery_id,
  };
  this.getDoorModels();
}
filterJoineryType(joineryType_id: any){
  this.paginateParameters.params ={
   ...this.paginateParameters.params,
   joineryTypeId: joineryType_id,
  };
  this.getDoorModels();
}
filterRoute(route_id: any){
  this.paginateParameters.params ={
   ...this.paginateParameters.params,
   routeId: route_id,
  };
  this.getDoorModels();
}
filterLine(line_id: any){
  this.paginateParameters.params ={
   ...this.paginateParameters.params,
   lineId: line_id,
  };
  this.getDoorModels();
}

}
