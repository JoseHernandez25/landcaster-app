import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, TemplateRef, ViewChild, inject, input } from '@angular/core';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';
import { HingeComponentService } from '../../../services/hingeComponent.service';
import { HingeComponent } from '../../../../interfaces/models/hingeComponent.interface';
import { PaginationService } from '../../../../shared/pagination/pagination.service';
import { PaginateParameters } from '../../../../interfaces/pagination.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorService } from '../../../../services/validator.service';
import { ConfirmationModalService } from '../../../../shared/services/confirmation-modal.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { CurrencieService } from '../../../services/currencie.service';


@Component({
  selector: 'app-hinges-component-section',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PaginationComponent], //agregar reactuve
  templateUrl: './hinges-component-section.component.html',
  styleUrl: './hinges-component-section.component.scss'
})
export class HingesComponentSection {
  @Output() hingeComponentName = new EventEmitter<string>();  //se utilizo para seleccionarlo

  private _term: string = ''; //es el termino para el buscador
  private _hingeComponentService = inject(HingeComponentService); //injeccion de dependencia del el servicio de com
  public hingesComponents: HingeComponent[] = [];
  public paginationService = inject(PaginationService); //llama el servicio para la paginacion
  public paginateParameters: PaginateParameters = {

    page_size: 20,
    page: 1,
    urlPrefix: 'hinge-components',
    params: {
      term: this._term // Término de búsqueda inicial
    }
  };

  private formBuilder = inject(FormBuilder);
  public isLoading: boolean = false;
  public selectedHingeComponent: HingeComponent | null = null;
  private modal = inject(NgbModal) //todo esto se agrega
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  public validatorService = inject(ValidatorService);
  public brands: any[] = [];
  public currencies: any[] = [];
  @ViewChild('modalStoreHingeComponent', { static: true }) modalStoreHingeComponent!: TemplateRef<any>;
  private confirmationModalService = inject(ConfirmationModalService);
  private toastService = inject(ToastService);
  private currencieService = inject(CurrencieService);


  public formStoreHingeComponents: FormGroup = this.formBuilder.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    price: ['', [Validators.required]],
    currencieId: ['', [Validators.required]],
    brandId: ['', [Validators.required]],
  });


  ngOnInit(): void {
    // Suscribirse a los cambios en la paginación
    this.paginationService.pagination$.subscribe(pagination => {
      this.hingesComponents = pagination.data; // Actualizar la lista de componentes
    });
    this.getHingesComponents(); // Obtener las bisagras al inicializar el componente
    this.getBrands();
    this.getCurrencies();

  }

  // Método para realizar una búsqueda de componentes
  search(term: string) {
    this._term = term; // Actualizar el término de búsqueda
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      term: term
    };
    this.getHingesComponents(); // Obtener los componentes con el término de búsqueda actualizado
  }

  getHingesComponents() {
    // Llamar al servicio de componentes bisagras para obtener los componentes con los parámetros de paginación actuales
    this._hingeComponentService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        this.paginationService.pagination$.next(pagination); // Actualizar la paginación
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  selectHingeComponents(hingeComponent: HingeComponent) {
    this.hingeComponentName.emit(hingeComponent.name); //se utilizo para seleccionarlo
    this.selectedHingeComponent = hingeComponent;

  }

  public formEditHingesComponents: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    price: ['', [Validators.required]],
    currencieId: ['', [Validators.required]],
    brandId: ['', [Validators.required]],

  });

  handleDoubleClick(hingeComponent: HingeComponent) {
    console.log(hingeComponent);
    this.formEditHingesComponents.setValue({
      id: hingeComponent.id,
      code: hingeComponent.code,
      name: hingeComponent.name,
      price: hingeComponent.price,
      currencieId: hingeComponent.currencieId,
      brandId: hingeComponent.brandId,

    });
    this.modal.open(this.modalContent, { size: 'lg' });

  }

  update() {
    this.isLoading = true;
    if (this.formEditHingesComponents.invalid) {
      this.isLoading = false;
      this.formEditHingesComponents.markAllAsTouched();
      return;
    }
    let formEditHingesComponents = this.formEditHingesComponents.value;
    if (this.selectedHingeComponent) {
      this._hingeComponentService.update(this.selectedHingeComponent?.id, formEditHingesComponents).subscribe({
        next: (resp) => {
          console.log(resp);
          this.getHingesComponents();
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

  delete() {
    const message = '¿Estás seguro de que deseas eliminar este registro?';
    this.confirmationModalService.openConfirmationModal(message).then(confirmed => {
      if (confirmed) {
        this.isLoading = true;
        if (this.selectedHingeComponent) {
          this._hingeComponentService.delete(this.selectedHingeComponent.id).subscribe({
            next: (resp) => {
              console.log(resp);
              this.getHingesComponents();
              this.selectedHingeComponent = null;
              this.toastService.showToast({
                message: `El color ${resp.name} se eliminó exitosamente`,
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
    if (this.formStoreHingeComponents.invalid) {
      this.isLoading = false;
      this.formStoreHingeComponents.markAllAsTouched();
      return;
    }
    let formStoreHingeComponents = this.formStoreHingeComponents.value;


    this._hingeComponentService.store(formStoreHingeComponents).subscribe({
      next: (resp) => {
        console.log(resp);
        this.getHingesComponents();
        this.modal.dismissAll(this.modalStoreHingeComponent);
        this.toastService.showToast({
          message: `El componente ${resp.name} se agregó exitosamente`,
          state: 'success'
        });
        this.formStoreHingeComponents.reset();
      },
      error(err) {
      },
    });
  }

  openStoreModal() {
    this.modal.open(this.modalStoreHingeComponent, { size: 'lg' });
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

  getBrands() {
    this._hingeComponentService.getBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}


