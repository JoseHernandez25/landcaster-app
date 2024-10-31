import { Component, EventEmitter, Output, TemplateRef, ViewChild, inject } from '@angular/core';
import { PaginationService } from '../../../../../shared/pagination/pagination.service';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../../../shared/pagination/pagination.component';
import { DrawerSlideComponent } from '../../../../../interfaces/models/drawerSlideComponents.interface';
import { PaginateParameters } from '../../../../../interfaces/pagination.interface';
import { DrawerSlideComponentsService } from '../../../../services/drawerSlideComponents.service';
import { CurrencieService } from '../../../../services/currencie.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalService } from '../../../../../shared/services/confirmation-modal.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import { ValidatorService } from '../../../../../services/validator.service';
import { UnitService } from '../../../../services/unit.service';



@Component({
  selector: 'app-drawer-slide-components-section',
  standalone: true,
  imports: [CommonModule, PaginationComponent, ReactiveFormsModule],
  templateUrl: './drawer-slide-components-section.component.html',
  styleUrl: './drawer-slide-components-section.component.scss'
})
export class DrawerSlideComponentsSectionComponent {
  public paginationService = inject(PaginationService); //llama el servicio para la paginacion
  public drawerSlideComponent: DrawerSlideComponent[] = [];
  private _term: string = ''; //es el termino para el buscador
  private _drawerSlideComponentService = inject(DrawerSlideComponentsService); //injeccion de dependencia del el servicio de com
  private currencieService = inject(CurrencieService);
  private unitService = inject(UnitService);
  @Output() drawerSlideComponentName = new EventEmitter<string>();  //se utilizo para seleccionarlo
  private formBuilder = inject(FormBuilder);
  private modal = inject(NgbModal) //todo esto se agrega
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  private confirmationModalService = inject(ConfirmationModalService);
  public isLoading: boolean = false;
  public selectedDrawerSlideComponents: DrawerSlideComponent | null = null;
  private toastService = inject(ToastService);
  public validatorService = inject(ValidatorService);
  @ViewChild('modalStoreDrawerSlideComponents', { static: true }) modalStoreDrawerSlideComponents!: TemplateRef<any>;

  public brands: any[] = [];
  public currencies: any[] = [];
  public units: any[] = [];

  public paginateParameters: PaginateParameters = {

    page_size: 20,
    page: 1,
    urlPrefix: 'drawer-slide-components',
    params: {
      term: this._term // Término de búsqueda inicial
    }
  };


  ngOnInit(): void {
    this.paginationService.pagination$.subscribe(pagination => {
      this.drawerSlideComponent = pagination.data; // Actualizar la lista de componentes
    });
    this.getDrawerSlideComponents();
    this.getCurrencies();
    this.getUnit();
    this.getBrands();
  }
  getDrawerSlideComponents() {
    // Llamar al servicio de componentes bisagras para obtener los componentes con los parámetros de paginación actuales
    this._drawerSlideComponentService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        console.log(pagination); // Mostrar la paginación en la consola
        this.paginationService.pagination$.next(pagination); // Actualizar la paginación
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  selectDrawerSlideComponents(drawerSlideComponent: DrawerSlideComponent) {
    console.log(drawerSlideComponent);

    this.drawerSlideComponentName.emit(drawerSlideComponent.name); //se utilizo para seleccionarlo
    this.selectedDrawerSlideComponents = drawerSlideComponent;

  }

  search(term: string) {
    this._term = term;
    console.log("sirve")
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      term: term
    };
    this.getDrawerSlideComponents();
  }

  public formEditDrawerSlideComponent: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    supplierCode: ['', [Validators.required]],
    name: ['', [Validators.required]],
    cost: ['', [Validators.required]],
    CurrencieId: ['', [Validators.required]],
    brandId: [],
    unitId: ['', [Validators.required]]

  });

  handleDoubleClick(drawerSlideComponent: DrawerSlideComponent) {
    console.log(drawerSlideComponent);
    this.formEditDrawerSlideComponent.setValue({
      id: drawerSlideComponent.id,
      supplierCode: drawerSlideComponent.supplierCode,
      name: drawerSlideComponent.name,
      cost: drawerSlideComponent.cost,
      brandId: drawerSlideComponent.brandId,
      CurrencieId: drawerSlideComponent.currencieId,
      unitId: drawerSlideComponent.unitId,
    });
    this.modal.open(this.modalContent, { size: 'lg' });

  }
  delete() {
    const message = '¿Estás seguro de que deseas eliminar este registro?';
    this.confirmationModalService.openConfirmationModal(message).then(confirmed => {
        if (confirmed) {
            this.isLoading = true;
            if (this.selectedDrawerSlideComponents) {
                this._drawerSlideComponentService.delete(this.selectedDrawerSlideComponents.id).subscribe({
                    next: (resp) => {
                        console.log(resp);
                        this.getDrawerSlideComponents(); // Actualiza la lista de accesorios externos
                        this.selectedDrawerSlideComponents = null;
                        this.toastService.showToast({
                            message: `La bisagra ${resp.name} se eliminó exitosamente`,
                            state: 'success'
                        });
                    },
                    error: (err) => {
                    },
                    complete: () => {
                        this.isLoading = false;
                    }
                });
            }
        }
    });
}

  update() {
    this.isLoading = true;
    if (this.formEditDrawerSlideComponent.invalid) {
      this.isLoading = false;
      this.formEditDrawerSlideComponent.markAllAsTouched();
      return;
    }
    let formEditDrawerSlideComponent = this.formEditDrawerSlideComponent.value;
    if (this.selectedDrawerSlideComponents) {
      this._drawerSlideComponentService.update(this.selectedDrawerSlideComponents?.id, formEditDrawerSlideComponent).subscribe({
        next: (resp) => {
          console.log(resp);
          this.getDrawerSlideComponents();
          this.modal.dismissAll(this.modalContent);
          this.toastService.showToast({
            message: `El componente ${resp.name} se edito exitosamente`,
            state: 'success'
          });

        },
        error(err) {
        },
      });
    }
  }

  openStoreModal() {
    this.modal.open(this.modalStoreDrawerSlideComponents, { size: 'lg' });
  }

  public formStoreDrawerSlideComponents: FormGroup = this.formBuilder.group({
    supplierCode: ['', [Validators.required]],
    name: ['', [Validators.required]],
    cost: ['', [Validators.required]],
    CurrencieId: ['', [Validators.required]],
    brandId: [],
    UnitId: ['', [Validators.required]]
  });

  store() {
    this.isLoading = true;
    if (this.formStoreDrawerSlideComponents.invalid) {
      this.isLoading = false;
      this.formStoreDrawerSlideComponents.markAllAsTouched();
      return;
    }
    let formStoreDrawerSlideComponents = this.formStoreDrawerSlideComponents.value;
    this._drawerSlideComponentService.store(formStoreDrawerSlideComponents).subscribe({
      next: (resp) => {
        this.getDrawerSlideComponents();
        this.modal.dismissAll(this.modalStoreDrawerSlideComponents);
        this.toastService.showToast({
          message: `La corredera ${resp.name} se agregó exitosamente`,
          state: 'success'
        });
        this.formStoreDrawerSlideComponents.reset();
      },
      error(err) {
        
      },
    });
  }

  getCurrencies() {
    this.currencieService.get().subscribe({
      next: (currencies) => {
        this.currencies = currencies;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getUnit() {
    this.unitService.getAll().subscribe({
      next: (units) => {
        this.units = units;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getBrands() {
    this._drawerSlideComponentService.getBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}


