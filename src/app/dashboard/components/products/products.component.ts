import { SubSubCategoriesService } from '../../services/sub-sub-categories.service';
import { Component, EventEmitter, Output, TemplateRef, ViewChild, ElementRef, inject } from '@angular/core';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PaginateParameters, Pagination } from '../../../interfaces/pagination.interface';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorService } from '../../../services/validator.service';
import { ConfirmationModalService } from '../../../shared/services/confirmation-modal.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../../interfaces/models/product.interface';
import { CurrencieService } from '../../services/currencie.service';
import { UnitService } from '../../services/unit.service';
import { CalculatePricePipe } from '../../pipes/calculate-price.pipe';
import { Subject, debounceTime } from 'rxjs';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ReactiveFormsModule, PaginationComponent, CommonModule, NgbModalModule, CalculatePricePipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  @Output() productName = new EventEmitter<string>();
  barcode: string = '';

  public products: any[] = [];
  public subsubcategories: any[] = [];
  public currencies: any[] = [];
  public brands: any[] = [];
  public units: any[] = [];
  private productsService = inject(ProductsService);
  public paginationService = inject(PaginationService);
  public unitsService = inject(UnitService);
  private _term: string = '';
  private modal = inject(NgbModal)
  public isLoading: boolean = false;
  public selectedProduct: Product | null = null;
  private formBuilder = inject(FormBuilder);
  public validatorService = inject(ValidatorService);
  private confirmationModalService = inject(ConfirmationModalService);
  private toastService = inject(ToastService);
  private _subsubcategoriesService = inject(SubSubCategoriesService);
  public SubSubCategoryId: number | string = '';
  private currencieService = inject(CurrencieService);
  private keyEventSubject = new Subject<string>();
  public existProductMessage: string | null = null;
  public existProduct!: boolean;

  public paginateParameters: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'categories',
    params: {
      term: this._term
    }
  };

  public formStoreProducts: FormGroup = this.formBuilder.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    increasefactor: ['', [Validators.required]],
    description: [''],
    cost: ['', [Validators.required]],
    // price: ['', [Validators.required]],
    brandId: ['', [Validators.required]],
    subsubcategoryId: ['', [Validators.required]],
    unitId: ['', [Validators.required]],
    currencieId: ['', [Validators.required]]
  });

  public formEditProducts: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    increasefactor: ['', [Validators.required]],
    description: [''],
    cost: ['', [Validators.required]],
    // price: ['', [Validators.required]],
    brandId: ['', [Validators.required]],
    subsubcategoryId: ['', [Validators.required]],
    unitId: ['', [Validators.required]],
    currencieId: ['', [Validators.required]]
  });
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  @ViewChild('modalStoreProduct', { static: true }) modalStoreProduct!: TemplateRef<any>;
  @ViewChild('inputTerm') inputTerm!: ElementRef;

  ngOnInit(): void {
    this.getProducts();
    this.getSubSubCategories();
    this.getCurrencies();
    this.getBrands();
    this.getUnits();

    this.keyEventSubject.pipe(
      debounceTime(500) // Cambia este valor según tus necesidades (500 ms es medio segundo)
    ).subscribe((barcode) => {
      console.log('consulta a la base de datos');
      console.log(barcode);
      this.verifyProduct();
    });
  }

  getProducts() {
    this.productsService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.paginationService.pagination$.next(pagination);
        this.products = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getUnits() {
    this.unitsService.getAll().subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.units = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getSubSubCategories() {
    this._subsubcategoriesService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.subsubcategories = pagination.data;
      },
      error: (err) => {
        console.log(err);
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


  getBrands() {
    this.productsService.getBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  selectProduct(product: Product) {
    console.log(product);
    this.productName.emit(product.name); //se utilizo para seleccionarlo
    this.selectedProduct = product;
  }

  handleDoubleClick(product: Product) {
    console.log(product);
    this.formEditProducts.setValue({
      id: product.id,
      code: product.code,
      name: product.name,
      increasefactor: product.increaseFactor,
      description: product.description,
      cost: product.cost,
      // price: product.price,
      brandId: product.brandId,
      subsubcategoryId: product.subSubCategoryId,
      unitId: product.unitId,
      currencieId: product.currencieId
    });
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  search(term: string) {
    console.log("Método search llamado desde el componente aa");
    this._term = term;
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      term: term
    };
    this.getProducts();
    console.log("SE obtuvo");
  }

  openStoreModal() {
    this.modal.open(this.modalStoreProduct, { size: 'lg' });
  }

  store() {
    this.isLoading = true;
    if (this.formStoreProducts.invalid) {
      this.isLoading = false;
      this.formStoreProducts.markAllAsTouched();
      return;
    }
    let formStoreProducts = this.formStoreProducts.value;
    console.log(formStoreProducts);

    this.productsService.store(formStoreProducts).subscribe({

      next: (resp) => {
        console.log("yaquedo")
        console.log(resp);
        this.getProducts();
        this.modal.dismissAll(this.modalStoreProduct);
        this.toastService.showToast({
          message: `El producto ${resp.name} se agregó exitosamente`,
          state: 'success'
        });
      },

      error(err) {

      },
    });
  }

  update() {
    this.isLoading = true;
    if (this.formEditProducts.invalid) {
      this.isLoading = false;
      this.formEditProducts.markAllAsTouched();
      return;
    }
    let formEditProducts = this.formEditProducts.value;
    if (this.selectedProduct) {
      this.productsService.update(this.selectedProduct.id, formEditProducts).subscribe({
        next: (resp) => {
          console.log(resp);
          this.getProducts();
          this.modal.dismissAll(this.modalContent);
          this.toastService.showToast({
            message: `El producto ${resp.name} se actualizó exitosamente`,
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
        if (this.selectedProduct) {
          this.productsService.delete(this.selectedProduct.id).subscribe({
            next: (resp) => {
              console.log(resp);
              this.getProducts();
              this.selectedProduct = null;
              this.toastService.showToast({
                message: `El producto ${resp.name} se eliminó exitosamente`,
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

  onKey(event: any) {
    this.barcode = event.target.value;
    this.keyEventSubject.next(this.barcode);
  }

  verifyProduct() {
    this.productsService.verifyProduct(this.barcode).subscribe({
      next: (resp) => {
        this.existProductMessage = resp.message;
        this.existProduct = false;
        // this.toastService.showToast({
        //   message: `El producto existe: ${this.existProductMessage}`,
        //   state: 'danger'
        // });
      },
      error: (resp) => {
        this.existProductMessage = resp.error.message;
        this.existProduct = true;
        // this.toastService.showToast({
        //   message: `El producto existe: ${this.existProductMessage}`,
        //   state: 'danger'
        // });
      },
    });
  }


}
