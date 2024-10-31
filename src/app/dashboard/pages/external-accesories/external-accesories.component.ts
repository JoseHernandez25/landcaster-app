import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { externalAccesoryService } from '../../services/externalAccesory.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PaginateParameters, Pagination } from '../../../interfaces/pagination.interface';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { ExternalAccesories } from '../../../interfaces/models/externalAccesory.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../shared/services/toast.service';
import { CurrencieService } from '../../services/currencie.service';
import { BrandsService } from '../../services/brands.service';
import { AccesorieTypeService } from '../../services/accesorieType.service';
import { ConfirmationModalService } from '../../../shared/services/confirmation-modal.service';
import { ValidatorService } from '../../../services/validator.service';

@Component({
  selector: 'app-external-accesories',
  standalone: true,
  imports: [ReactiveFormsModule, PaginationComponent, CommonModule, NgbModalModule],
  templateUrl: './external-accesories.component.html',
  styleUrl: './external-accesories.component.scss'
})
export default class ExternalAccesoriesComponent {
  private externalAccesoryService = inject(externalAccesoryService);
  public paginationService = inject(PaginationService);
  public externalAccesory: ExternalAccesories[] = [];
  public brandId: number | string = '';
  public orderByAsc: boolean = true;
  public term: string = '';
  private formBuilder = inject(FormBuilder);
  @ViewChild('modalStoreExternalAccesory', { static: true }) modalStoreExternalAccesory!: TemplateRef<any>;
  public isLoading: boolean = false;
  private modal = inject(NgbModal)
  private toastService = inject(ToastService);
  public currencies: any[] = [];
  public brands: any[] = [];
  public accesorieType: any[] = [];
  private CurrencieService = inject(CurrencieService);
  private accesoriesTypesService = inject(AccesorieTypeService);
  public selectedExternalAccesorie: ExternalAccesories | null = null;
  private confirmationModalService = inject(ConfirmationModalService);
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  public validatorService = inject(ValidatorService);

  private BrandsService = inject(BrandsService);

  public paginateParameters: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'external-accesory',
    params: {
      term: this.term,
      brandId: this.brandId,
      orderByAsc: this.orderByAsc,
      orderBy: this.orderByAsc,

    }
  };

  public paginateParametersAcc: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'accesorie-type',
  };

 
  constructor() {}

  ngOnInit(): void {

  this.getExternalAccesories();
  this.getBrands();
  this.getCurrencies();
  this.getAccesoriesTypes();
  }

  getExternalAccesories() {
    this.externalAccesoryService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.paginationService.pagination$.next(pagination);
        this.externalAccesory = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
    }
    
    search(event: any) {
      this.term = event.target.value;
      this.paginateParameters.params = {
        ...this.paginateParameters.params,
        term: this.term
       
      };
      this.getExternalAccesories();
  }

  openStoreModal() {
    this.modal.open(this.modalStoreExternalAccesory, { size: 'lg' });
  }

  public formEditExternalAccesories: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    cost: ['', [Validators.required]],
    increaseFactor: ['', [Validators.required]],
    brandId: [],
    currencieId: [],
    accesorieTypeId: [],
    financingParameterId: [],

  });

  handleDoubleClick(externalAccesory: ExternalAccesories) {
    this.formEditExternalAccesories.setValue({
      id: externalAccesory.id,
      code: externalAccesory.code,
      name: externalAccesory.name,
      cost: externalAccesory.cost,
      increaseFactor: externalAccesory.increaseFactor,
      brandId: externalAccesory.brandId,
      currencieId: externalAccesory.currencieId,
      accesorieTypeId: externalAccesory.accesorieTypeId,
      financingParameterId: externalAccesory.financingParameterId,
    });
    this.modal.open(this.modalContent, { size: 'lg' });

  }

  public formStoreExternalAccesory: FormGroup = this.formBuilder.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    cost: ['', [Validators.required]],
    increaseFactor: [],
    brandId: [],
    currencieId: [],
    accesorieTypeId: [],
    financingParameterId: []
  });

  store() {
    this.isLoading = true;
    if (this.formStoreExternalAccesory.invalid) {
      this.isLoading = false;
      this.formStoreExternalAccesory.markAllAsTouched();
      return;
    }
    let formStoreExternalAccesory = this.formStoreExternalAccesory.value;

    this.externalAccesoryService.store(formStoreExternalAccesory).subscribe({
      next: (resp) => {
        console.log(resp);
        this.getExternalAccesories();
        this.modal.dismissAll(this.modalStoreExternalAccesory);
        this.toastService.showToast({
          message: `El color ${resp.name} se agregó exitosamente`,
          state: 'success'
        });
        this.formStoreExternalAccesory.reset();
      },
      error(err) {
      },
    });
  }

  update() {
    this.isLoading = true;
    if (this.formEditExternalAccesories.invalid) {
      this.isLoading = false;
      this.formEditExternalAccesories.markAllAsTouched();
      return;
    }
    let formEditExternalAccesories = this.formEditExternalAccesories.value;
    if (this.selectedExternalAccesorie) {
      this.externalAccesoryService.update(this.selectedExternalAccesorie?.id, formEditExternalAccesories).subscribe({
        next: (resp) => {
          this.getExternalAccesories();
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
            if (this.selectedExternalAccesorie) {
                this.externalAccesoryService.delete(this.selectedExternalAccesorie.id).subscribe({
                    next: (resp) => {
                        console.log(resp);
                        this.getExternalAccesories(); // Actualiza la lista de accesorios externos
                        this.selectedExternalAccesorie = null;
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

  clear() {
    this.formStoreExternalAccesory.reset();
  }

  getCurrencies() {
    this.CurrencieService.get().subscribe({
      next: (currencies) => {
        this.currencies = currencies;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getBrands() {
    this.externalAccesoryService.getBrands().subscribe({
      next: (brands) => {
        console.log(brands);
        this.brands = brands;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getAccesoriesTypes() {
    this.accesoriesTypesService.get(this.paginateParametersAcc).subscribe({
      next: (pagination) => {
        this.accesorieType = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  selectExternalAccesory(externalAccesory: ExternalAccesories) {
    this.selectedExternalAccesorie = externalAccesory;
  }
}
