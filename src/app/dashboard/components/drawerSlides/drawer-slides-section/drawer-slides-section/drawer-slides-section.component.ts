import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, TemplateRef, ViewChild, inject, input } from '@angular/core';
import { PaginationComponent } from '../../../../../shared/pagination/pagination.component';
import { DrawerSlideService } from '../../../../services/drawerSlide.service';
import { DrawerSlide } from '../../../../../interfaces/models/drawerSlide.interface';
import { PaginationService } from '../../../../../shared/pagination/pagination.service';
import { PaginateParameters } from '../../../../../interfaces/pagination.interface';
import { DrawerSlideComponent } from '../../../../../interfaces/models/drawerSlideComponents.interface';
import { ToastService } from '../../../../../shared/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorService } from '../../../../../services/validator.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DrawerSlideTypeService } from '../../../../services/drawerSlideType.service';
import { ConfirmationModalService } from '../../../../../shared/services/confirmation-modal.service';
import { CalculatePricePipe } from '../../../../pipes/calculate-price.pipe';
import { CalculateCostPipe } from '../../../../pipes/calculate-cost.pipe';
import { FilterDrawerSlideComponentPipe } from '../../../../../pipes/filte_drawerSlide.pipe';
import { DrawerSlideComponentsService } from '../../../../services/drawerSlideComponents.service';

@Component({
  selector: 'app-drawer-slides-section',
  standalone: true,
  imports: [FormsModule, CommonModule, PaginationComponent, ReactiveFormsModule, CalculatePricePipe, CalculateCostPipe, FilterDrawerSlideComponentPipe],
  templateUrl: './drawer-slides-section.component.html',
  styleUrl: './drawer-slides-section.component.scss'
})
export class DrawerSlidesSectionComponent {
  @Output() drawerSlideName = new EventEmitter<string>();  //se utilizo para seleccionarlo
  public isLoading: boolean = false;
  public selectedDrawerSlide: DrawerSlide | null = null;
  private toastService = inject(ToastService);
  private drawerSlideComponentsService = inject(DrawerSlideComponentsService);

  private modal = inject(NgbModal) //todo esto se agrega
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  public validatorService = inject(ValidatorService);
  private formBuilder = inject(FormBuilder);
  public brands: any[] = [];
  public drawerSlideTypes: any[] = [];
  private confirmationModalService = inject(ConfirmationModalService);
  @ViewChild('modalStoreDrawerSlide', { static: true }) modalStoreDrawerSlide!: TemplateRef<any>;
  private DrawerSlideTypeService = inject(DrawerSlideTypeService);
  public searchtext: any;
  public selectedIndex: number = -1;
  public drawerSlideComponents: any[] = [];
  selectedComponent: DrawerSlideComponent | null = null; // Variable para almacenar el componente seleccionado
  selectedQuantity: number = 1;
  showComponentList: boolean = true;
  componentSelected: boolean = false;



  private drawerSlideTypeService = inject(DrawerSlideTypeService);

  public paginateParametersType: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'drawer-slide-type',
  };
  private _term: string = '';
  private _drawerSlideService = inject(DrawerSlideService);
  public drawerSlides: DrawerSlide[] = [];
  public DrawerSlideComponent: DrawerSlideComponent[] = [];
  public paginationService = inject(PaginationService);
  public drawerSlideTypeId: number | string = '';
  public brandId: number | string = '';

  public paginateParameters: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'drawer-slide',
    params: {
      term: this._term, // Término de búsqueda inicial
      drawerSlideTypeId: this.drawerSlideTypeId,
      brandId: this.brandId
    }
  };

  ngOnInit(): void {
    // Suscribirse a los cambios en la paginación
    this.paginationService.pagination$.subscribe(pagination => {
      this.drawerSlides = pagination.data;
    });
    this.getDrawerSlide();
    this.getBrands();
    this.getDrawerSlideType(); 3
    this.getDrawerSlideComponents();
  }

  search(term: string) {
    this._term = term;
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      term: term
    };
    this.getDrawerSlide();
  }

  openComponents(DrawerSlideComponent: DrawerSlideComponent[]) {
    this.DrawerSlideComponent = DrawerSlideComponent;
    console.log(this.DrawerSlideComponent);

  }

  //cambio
  getDrawerSlide() {
    this._drawerSlideService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.paginationService.pagination$.next(pagination);
        this.drawerSlides = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  //para select
  selectDrawerSlide(drawerSlide: DrawerSlide) {
    console.log(drawerSlide);

    this.drawerSlideName.emit(drawerSlide.name); //se utilizo para seleccionarlo
    this.selectedDrawerSlide = drawerSlide;

  }

  public formEditDrawerSlide: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    price: ['', [Validators.required]],
    cost: ['', [Validators.required]],
    description: [],
    drawerSlideTypeId: ['', [Validators.required]],
    brandId: [],
    increaseFactor: [],

  });
  handleDoubleClick(drawerSlide: DrawerSlide) {
    console.log(drawerSlide);
    this.formEditDrawerSlide.setValue({
      id: drawerSlide.id,
      code: drawerSlide.code,
      name: drawerSlide.name,
      price: drawerSlide.price,
      cost: drawerSlide.cost,
      description: drawerSlide.description,
      drawerSlideTypeId: drawerSlide.drawerSlideTypeId,
      brandId: drawerSlide.brandId,
      increaseFactor: drawerSlide.increaseFactor,
    });
    this.modal.open(this.modalContent, { size: 'lg' });

  }
  delete() {
    const message = '¿Estás seguro de que deseas eliminar este registro?';
    this.confirmationModalService.openConfirmationModal(message).then(confirmed => {
      if (confirmed) {
        this.isLoading = true;
        if (this.selectedDrawerSlide) {
          this._drawerSlideService.delete(this.selectedDrawerSlide.id).subscribe({
            next: (resp) => {
              console.log(resp);
              this.getDrawerSlide();
              this.selectedDrawerSlide = null;
              this.toastService.showToast({
                message: `La corredera ${resp.name} se eliminó exitosamente`,
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

  update() {
    this.isLoading = true;
    if (this.formEditDrawerSlide.invalid) {
      this.isLoading = false;
      this.formEditDrawerSlide.markAllAsTouched();
      return;
    }
    let formEditDrawerSlide = this.formEditDrawerSlide.value;
    if (this.selectedDrawerSlide) {
      this._drawerSlideService.update(this.selectedDrawerSlide?.id, formEditDrawerSlide).subscribe({
        next: (resp) => {
          console.log(resp);
          this.getDrawerSlide();
          this.modal.dismissAll(this.modalContent);
          this.toastService.showToast({
            message: `La corredera ${resp.name} se edito exitosamente`,
            state: 'success'
          });

        },
        error(err) {
        },
      });
    }
  }

  openStoreModal() {
    this.modal.open(this.modalStoreDrawerSlide, { size: 'lg' });
  }

  getBrands() {
    this._drawerSlideService.getBrands().subscribe({
      next: (brands) => {
        console.log(brands);
        this.brands = brands;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getDrawerSlideType() {
    this.drawerSlideTypeService.get(this.paginateParametersType).subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.drawerSlideTypes = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  public formStoreDrawerSlide: FormGroup = this.formBuilder.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    price: ['', [Validators.required]],
    cost: ['', [Validators.required]],
    description: [],
    drawerSlideTypeId: ['', [Validators.required]],
    brandId: [],
    increaseFactor: [],
    drawerSlideComponentsIds: [],
    quantity: [],
  });

  store() {
    this.isLoading = true;
    if (this.formStoreDrawerSlide.invalid) {
      this.isLoading = false;
      this.formStoreDrawerSlide.markAllAsTouched();
      return;
    }
    const codeValue = this.formStoreDrawerSlide.get('code')?.value;
    const nameValue = this.formStoreDrawerSlide.get('name')?.value;
    const priceValue = this.formStoreDrawerSlide.get('price')?.value;
    const costValue = this.formStoreDrawerSlide.get('cost')?.value;
    const descriptionValue = this.formStoreDrawerSlide.get('description')?.value;
    const drawerSlideTypeIdValue = this.formStoreDrawerSlide.get('drawerSlideTypeId')?.value;
    const brandIdValue = this.formStoreDrawerSlide.get('brandId')?.value;
    const increaseFactorValue = this.formStoreDrawerSlide.get('increaseFactor')?.value;

    let drawerSlideComponentsIds = this.drawerSlideComponents.map(
      (drawerSlideComponents) => drawerSlideComponents.id
    );

    const requestBody = {
      drawerSlide: {
        name: nameValue,
        code: codeValue,
        price: priceValue,
        cost: costValue,
        description: descriptionValue,
        drawerSlideTypeId: drawerSlideTypeIdValue,
        brandId: brandIdValue,
        increaseFactor: increaseFactorValue,
      },
      drawerSlideComponentsIds: drawerSlideComponentsIds
    };

    this._drawerSlideService.store(requestBody).subscribe({
      next: (resp) => {
        console.log('Delete response:', resp);

        this.modal.dismissAll(this.modalStoreDrawerSlide);
        this.toastService.showToast({
          message: `La Corredera ${resp.name} se agregó exitosamente`,
          state: 'success',
        });
        this.formStoreDrawerSlide.reset();
        this.drawerSlideComponents = [];
      },
      error(err) {
        console.error('Error while deleting:', err);
      },
    });
  }

  filterType(type_id: any) {
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      drawerSlideTypeId: type_id, // Asegúrate de usar la clave correcta
    };
    this.getDrawerSlide(); // Recupera datos con el filtro actualizado
  }
  filterBrand(brand_id: any) {
    console.log('Filtrando por BrandId:', brand_id);
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      brand_id: brand_id
    };
    this.getDrawerSlide();
  }

  getPrices(drawerSlide: DrawerSlide[]) {
    const prices = drawerSlide.map(c => c.price);
    return prices;
  }

  navigateUp() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  navigateDown() {
    if (this.selectedIndex < this.DrawerSlideComponent.length - 1) {
      this.selectedIndex++;
    }
  }

  selectDrawerSlideComponentsFromKeyboard() {
    if (this.selectedIndex !== -1) {
      const selectedDrawerSlideComponents = this.DrawerSlideComponent[this.selectedIndex];
      this.selectDrawerSlideComponents(selectedDrawerSlideComponents);
    }
  }

  deleteSelectedDrawerSlideComponents(index: number) {
    this.drawerSlideComponents.splice(index, 1); // Usa splice() para eliminar el elemento en el índice dado
    console.log(this.drawerSlideComponents);
  }

  getDrawerSlideComponents() {
    this.drawerSlideComponentsService.getDrawerSlideComponents().subscribe(
      {
        next: (resp) => {
          console.log(resp);
          this.drawerSlideComponents = resp;
        },
        error: (err) => {

        },
      }
    );
  }


  selectDrawerSlideComponents(drawerSlideComponent: DrawerSlideComponent) {
    // Verificar si el componente ya está en la lista de componentes seleccionados
    let existItem = this.drawerSlideComponents.some(
      (mt) => mt.id == drawerSlideComponent.id
    );
    // Si el componente ya existe en la lista, mostrar un mensaje de advertencia y salir
    if (existItem) {
      this.toastService.showToast({
        message: `El ${drawerSlideComponent.name} ya existe.`,
        state: 'danger',
      });
      return;
    }
    this.selectedComponent = drawerSlideComponent;
    this.showComponentList = false;
  }


  addToSelected() {
    const quantity = this.formStoreDrawerSlide.get('quantity')?.value;
    if (!this.selectedComponent || !quantity) {
      // Asegúrate de que hay un componente seleccionado y una cantidad válida antes de continuar
      return;
    }

    const componentDetail = {
      quantity: quantity,
      id: this.selectedComponent.id,
      name: this.selectedComponent.name,
      code: this.selectedComponent.supplierCode,
    };

    // Añadir el componente seleccionado al arreglo de componentes
    this.drawerSlideComponents.push(componentDetail);

    // Restablecer el componente seleccionado y el estado del formulario
    this.selectedComponent = null;
    this.componentSelected = false;
    this.formStoreDrawerSlide.get('quantity')?.setValue('');
    this.searchtext = '';
    this.showComponentList = true;

    // Actualizar los IDs de los componentes seleccionados
    this.drawerSlideComponents = this.drawerSlideComponents.map(component => {
      const ids = [];
      for (let index = 0; index < component.quantity; index++) {
        ids.push(component.id);
      }
      return ids;
    });

  }
  clear() {
    this.drawerSlideComponents = []; // Limpiar la lista de componentes seleccionados
    this.formStoreDrawerSlide.reset(); // Restablecer el formulario
  }


  discardSelection() {
    this.selectedComponent = null; // Reiniciar a null
    this.selectedQuantity = 0; // Reiniciar a 0
    this.showComponentList = true; // Restaurar a true
    this.selectedIndex = -1; // Reiniciar el índice seleccionado
    this.searchtext = ''; // Limpiar el campo de búsqueda
  }




}




