import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewChild, inject } from '@angular/core';
import { Hinge, HingeHingeComponent } from '../../../../interfaces/models/hinge.interface';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';
import { PaginateParameters } from '../../../../interfaces/pagination.interface';
import { HingesService } from '../../../services/hinges.service';
import { PaginationService } from '../../../../shared/pagination/pagination.service';
import { HIngeHingeComponent, HingeComponent } from '../../../../interfaces/models/hingeComponent.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorService } from '../../../../services/validator.service';
import { ConfirmationModalService } from '../../../../shared/services/confirmation-modal.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { AngleService } from '../../../services/angle.service';
import { HingeTypeService } from '../../../services/hingeType.service';
import { CalculatePricePipe } from '../../../pipes/calculate-price.pipe';
import { CalculateCostPipe } from '../../../pipes/calculate-cost.pipe';
import { FilterHingeTypePipe } from '../../../../pipes/filte-hinge.pipe';
import { HingeComponentService } from '../../../services/hingeComponent.service';

@Component({
  selector: 'app-hinges-section',
  standalone: true,
  imports: [CommonModule, PaginationComponent, ReactiveFormsModule, CalculatePricePipe, CalculateCostPipe, FilterHingeTypePipe, FormsModule],
  templateUrl: './hinges-section.component.html',
  styleUrl: './hinges-section.component.scss'
})
export class HingesSectionComponent {
  @Output() hingeName = new EventEmitter<string>();  //se utilizo para seleccionarlo
  @Output() Brandfilter = new EventEmitter<String>();
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  @ViewChild('modalStoreHinge', { static: true }) modalStoreHinge!: TemplateRef<any>;
  @Output() brandSelected = new EventEmitter<string>();
  @ViewChild('inputTerm') inputTerm!: ElementRef;
  @ViewChild('selectBrandId') selectBrandId!: ElementRef;
  @ViewChild('selectHingeTypeId') selectHingeTypeId!: ElementRef;
  public selectedHinge: Hinge | null = null;
  private formBuilder = inject(FormBuilder);
  private modal = inject(NgbModal) //todo esto se agrega
  public isLoading: boolean = false;
  public validatorService = inject(ValidatorService);
  public brands: any[] = [];
  public angle: any[] = [];
  public hingesTypes: any[] = [];
  private _term: string = '';
  private _hingesService = inject(HingesService);
  private _hingesComponentsService = inject(HingeComponentService);
  public Hinge: any[] = [];
  public hingeHingeComponents: HingeHingeComponent[] = [];
  public choseHingeComponents: HingeComponent[] = [];

  private confirmationModalService = inject(ConfirmationModalService);
  private toastService = inject(ToastService);
  public brandId: number | string = '';
  private angleService = inject(AngleService);
  public HingeTypeId: number | string = ''; //checar
  public term: string = '';
  public hingeTypeId: number | string = '';
  public orderByAsc: boolean = true;
  public paginationService = inject(PaginationService);
  public selectedIndex: number = -1;

  public selectedHingeComponent!: HingeHingeComponent;
  selectedBrand: boolean = false;
  private hingeTypeService = inject(HingeTypeService);
  selectedComponent: HingeComponent | null = null; // Variable para almacenar el componente seleccionado
  selectedQuantity: number = 1;
  showComponentList: boolean = true;
  showList: boolean = false;

  public paginateParametersAng: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'angle',
  };

  public paginateParametersType: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'hingeType',
  };

  public paginateParameters: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'hinges',
    params: {
      term: this._term,
      hingeTypeId: this.hingeTypeId,
      brandId: this.brandId,
      orderByAsc: this.orderByAsc,
      orderBy: this.orderByAsc,

    }
  };
  public formStoreHinge: FormGroup = this.formBuilder.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    description: [],
    observation: [],
    increaseFactor: [],
    brandId: ['', [Validators.required]],
    angleId: ['', [Validators.required]],
    hingeTypeId: ['', [Validators.required]],
    componentsIds: [],
    quantity: []
  });

  public formEditHinges: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    code: ['', [Validators.required]],
    increaseFactor: ['', [Validators.required]],
    name: ['', [Validators.required]],
    brandId: ['', [Validators.required]],
    angleId: ['', [Validators.required]],
    hingeTypeId: ['', [Validators.required]],
    quantity: []

  });

  ngOnInit(): void {
    this.paginationService.pagination$.subscribe(pagination => {
      this.Hinge = pagination.data;
    });
    document.addEventListener('click', this.handleClickOutside.bind(this));
    this.getHinges();
    this.getBrands();
    this.getHingeTypes();
    this.getAngle();
  }

  search(term: string) {
    this._term = term;
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      term: term
    };
    this.getHinges();
  }

  openComponents(hingeComponent: HingeComponent[]) {
    // this.hingeComponents = hingeComponent;

  }

  getHinges() {
    this._hingesService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        console.log(pagination);

        this.paginationService.pagination$.next(pagination);
        this.Hinge = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  selectHinge(hinge: Hinge) {
    console.log(hinge);

    this.hingeName.emit(hinge.name); //se utilizo para seleccionarlo
    this.selectedHinge = hinge;

  }

  calcularCostoTotalPorBisagra(hinge: any): number {
    // Verificar si la bisagra tiene componentes
    if (!hinge || !hinge.components || hinge.components.length === 0) {
      return 0;
    }
    return hinge.components.reduce((total: number, component: any) => total + component.price, 0);
  }

  getPrices(hingeComponent: HIngeHingeComponent[]) {
    const prices = hingeComponent.map(hingeComponent => hingeComponent.component.price);
    return prices;
  }

  handleDoubleClick(hinge: Hinge) {
    this.hingeHingeComponents = hinge.hingeHingeComponents;
    this.formEditHinges.setValue({
      id: hinge.id,
      code: hinge.code,
      name: hinge.name,
      brandId: hinge.brandId,
      angleId: hinge.angleId,
      hingeTypeId: hinge.hingeTypeId,
      increaseFactor: hinge.increaseFactor,
      quantity: 1
    });
    this.modal.open(this.modalContent, { size: 'lg' });

  }

  update() {
    this.isLoading = true;
    if (this.formEditHinges.invalid) {
      this.isLoading = false;
      this.formEditHinges.markAllAsTouched();
      return;
    }
    let formEditHinges = this.formEditHinges.value;
    const code = this.formEditHinges.get('code')?.value;
    const name = this.formEditHinges.get('name')?.value;
    const description = this.formEditHinges.get('description')?.value;
    const observation = this.formEditHinges.get('observation')?.value;
    const brandId = this.formEditHinges.get('brandId')?.value;
    const angleId = this.formEditHinges.get('angleId')?.value;
    const hingeTypeId = this.formEditHinges.get('hingeTypeId')?.value;
    const increaseFactor = this.formEditHinges.get('increaseFactor')?.value;

    const components = this.hingeHingeComponents.map(hhc => {
      return { componentId: hhc.component.id, quantity: hhc.quantity }
    })

    const requestBody = {
      hinge: {
        id: this.selectedHinge?.id,
        code: code,
        name: name,
        description: description, // Esto puede ser nulo o vacío
        observation: observation, // Esto puede ser nulo o vacío
        brandId: brandId,
        angleId: angleId,
        hingeTypeId: hingeTypeId,
        increaseFactor: increaseFactor
      },
      components: components
    };
    console.log('Request Body:', requestBody);
    if (this.selectedHinge) {
      this._hingesService.update(this.selectedHinge?.id, requestBody).subscribe({
        next: (resp) => {
          this.getHinges();
          this.modal.dismissAll(this.modalContent);
          this.toastService.showToast({
            message: `La bisagra ${resp.name} se edito exitosamente`,
            state: 'success'
          });

        },
        error(err) {
        },
      });
    }
  }

  delete() {
    const message = '¿Estás seguro de que deseas eliminar este registro?';
    this.confirmationModalService.openConfirmationModal(message).then(confirmed => {
      if (confirmed) {
        this.isLoading = true;
        if (this.selectedHinge) {
          this._hingesService.delete(this.selectedHinge.id).subscribe({
            next: (resp) => {
              this.getHinges();
              this.selectedHinge = null;
              this.toastService.showToast({
                message: `La bisagra ${resp.name} se eliminó exitosamente`,
                state: 'success'
              });
            },
            error(err) {

            },
          });
        }
      }
    });
  }


  store() {
    this.isLoading = true;
    if (this.formStoreHinge.invalid) {
      this.isLoading = false;
      this.formStoreHinge.markAllAsTouched();
      return;
    }
    const code = this.formStoreHinge.get('code')?.value;
    const name = this.formStoreHinge.get('name')?.value;
    const description = this.formStoreHinge.get('description')?.value;
    const observation = this.formStoreHinge.get('observation')?.value;
    const brandId = this.formStoreHinge.get('brandId')?.value;
    const angleId = this.formStoreHinge.get('angleId')?.value;
    const hingeTypeId = this.formStoreHinge.get('hingeTypeId')?.value;
    const increaseFactor = this.formStoreHinge.get('increaseFactor')?.value;

    const components = this.hingeHingeComponents.map(hhc => {
      return { componentId: hhc.component.id, quantity: hhc.quantity }
    })


    const requestBody = {
      hinge: {
        code: code,
        name: name,
        description: description, // Esto puede ser nulo o vacío
        observation: observation, // Esto puede ser nulo o vacío
        brandId: brandId,
        angleId: angleId,
        hingeTypeId: hingeTypeId,
        increaseFactor: increaseFactor
      },
      components: components
    };
    console.log('Request Body:', requestBody);

    this._hingesService.store(requestBody).subscribe({
      next: (resp) => {

        this.modal.dismissAll(this.modalStoreHinge);
        this.toastService.showToast({
          message: `La bisagra ${resp.name} se agregó exitosamente`,
          state: 'success',
        });
        this.formStoreHinge.reset();
        this.hingeHingeComponents = [];
      },
      error(err) {
        console.error('Error while deleting:', err);
      },

    });
  }

  openStoreModal() {
    this.modal.open(this.modalStoreHinge, { size: 'lg' });
  }

  getHingeTypes() {
    this.hingeTypeService.get(this.paginateParametersType).subscribe({
      next: (pagination) => {
        this.hingesTypes = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getAngle() {
    this.angleService.get(this.paginateParametersAng).subscribe({
      next: (pagination) => {
        this.angle = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getBrands() {
    this._hingesService.getBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  filterType(type_id: any) {
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      hingeTypeId: type_id, // Asegúrate de usar la clave correcta 
    };
    this.getHinges(); // Recupera datos con el filtro actualizado
  }

  filterBrand(brand_id: any) {
    console.log('Filtrando por BrandId:', brand_id);
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      brand_id: brand_id
    };
    this.getHinges();
  }


  navigateUp() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  navigateDown() {
    if (this.selectedIndex < this.choseHingeComponents.length - 1) {
      this.selectedIndex++;
    }
  }


  selectHingeComponentFromKeyboard() {
    if (this.selectedIndex !== -1) {
      const selectHingeComponents = this.choseHingeComponents[this.selectedIndex];
      this.selectHingeComponent(selectHingeComponents);
    }
  }

  deletehingeHingeComponents(index: number) {
    this.hingeHingeComponents.splice(index, 1); // Usa splice() para eliminar el elemento en el índice dado
    console.log(this.hingeHingeComponents);
  }

  handleClickOutside(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    const listContainer = document.querySelector('.list-group.position-absolute');
    if (listContainer && !listContainer.contains(targetElement)) {
      // Si el clic no está dentro del área de la lista, cierra la lista
      this.term = ''; // Esto limpiará el texto de búsqueda y hará que desaparezca la lista
    }
  }

  deleteHingeComponent(hingeId: number, componentId: number) {
    // Muestra un mensaje de confirmación al usuario antes de eliminar el componente
    const message = '¿Estás seguro de que deseas eliminar este componente?';
    this.confirmationModalService.openConfirmationModal(message).then(confirmed => {
      // Si el usuario confirma la eliminación
      if (confirmed) {
        // Llama al servicio para eliminar el componente de la bisagra
        this._hingesService.deleteComponent(hingeId, componentId).subscribe({
          // Si la eliminación es exitosa
          next: (resp) => {
            console.log(resp);
            // Aquí puedes actualizar tu vista si es necesario
          },
          // Si hay un error durante la eliminación
          error: (err) => {
            console.error(err);
            // Manejo de errores
          }
        });
      }
    });
  }


  getComponentsByBrand(event: any) {
    const selectedBrandId = event.target.value;
    this._hingesComponentsService.getComponentsByBrand(selectedBrandId).subscribe({
      next: (resp) => {
        console.log(resp);

        this.selectedBrand = true;
        this.choseHingeComponents = resp;
        this.term = ''; // Restablecer el valor del campo de búsqueda
        this.formStoreHinge.get('quantity')?.setValue('');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  selectHingeComponent(hingeComponent: HingeComponent) {
    // Verificar si el componente ya está en la lista de componentes seleccionados
    let existItem = this.hingeHingeComponents.some(
      (mt) => mt.id == hingeComponent.id
    );
    // Si el componente ya existe en la lista, mostrar un mensaje de advertencia y salir
    if (existItem) {
      this.toastService.showToast({
        message: `El ${hingeComponent.name} ya existe.`,
        state: 'danger',
      });
      return;
    }
    this.selectedComponent = hingeComponent;
    this.showList = false;
  }

  addToSelected() {
    // Obtener las cantidades de los formularios
    const quantityStore = this.formStoreHinge.get('quantity')?.value as number;
    const quantityEdit = this.formEditHinges.get('quantity')?.value as number;

    if (!this.selectedComponent || (!quantityStore && !quantityEdit)) {
      return;
    }

    const finalQuantity = quantityEdit || quantityStore;

    this.hingeHingeComponents.push({ quantity: finalQuantity, component: this.selectedComponent });
    console.log(this.hingeHingeComponents);

    // Restablecer el componente seleccionado y el estado del formulario
    this.selectedComponent = null;
    this.showList = false;
    this.formStoreHinge.get('quantity')?.setValue('');
    this.formEditHinges.get('quantity')?.setValue('');
  }


  discardSelection() {
    const index = this.hingeHingeComponents.indexOf(this.selectedHingeComponent);
    if (index > -1) {
      this.hingeHingeComponents.splice(index, 1);
    }
  }

  searchText(e: any) {
    this.term = e.target.value;
    this.showList = true;
  }

  clear() {
    this.formStoreHinge.reset();
    this.hingeHingeComponents = [];
  }
  selectHingeComponentTable(hingeHingeComponent: HingeHingeComponent) {
    console.log(hingeHingeComponent);

    this.selectedHingeComponent = hingeHingeComponent;
  }
}


