import { SubCategory } from '../../../interfaces/models/subCategory.interface';
import { Component, EventEmitter, Output, TemplateRef, ViewChild, ElementRef, inject } from '@angular/core';
import { SubCategoriesService } from '../../services/sub-categories.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PaginateParameters, Pagination } from '../../../interfaces/pagination.interface';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorService } from '../../../services/validator.service';
import { ConfirmationModalService } from '../../../shared/services/confirmation-modal.service';
import { ToastService } from '../../../shared/services/toast.service';
import { CategoriesService } from '../../services/categories.service';
import { Brand } from '../../../interfaces/models/color.interface';
// import { FilterSubCategoryPipe } from '../../../pipes/filte_subCategories.pipe';

@Component({
  selector: 'app-sub-categories',
  standalone: true,
  imports: [ReactiveFormsModule, PaginationComponent, CommonModule, NgbModalModule],
  templateUrl: './sub-categories.component.html',
  styleUrl: './sub-categories.component.scss'
})
export class SubCategoriesComponent {
  brandSelected: boolean = false;
  showBrandList: boolean = true;
  @Output() subCategoryName = new EventEmitter<string>();  //se utilizo para seleccionarlo
  public categories: any[] = [];
  public subcategories: any[] = [];
  public brands: any[] = [];
  public selectedBrands: any[] = [];
  private subcategoriesService = inject(SubCategoriesService);
  public paginationService = inject(PaginationService);
  private _term: string = '';
  private modal = inject(NgbModal)
  public isLoading: boolean = false;
  public CategoryId: number | string = '';
  public selectedSubCategory: SubCategory | null = null;
  private formBuilder = inject(FormBuilder);
  public validatorService = inject(ValidatorService);
  private confirmationModalService = inject(ConfirmationModalService);
  private toastService = inject(ToastService);
  private _categoriesService = inject(CategoriesService);
  public term: string = '';
  public searchtext: any;
  public selectedIndex: number = -1;
  selectedBrand: Brand | null = null; // Variable para almacenar el componente seleccionado


  public paginateParameters: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'subcategories',
    params: {
      term: this._term,
      categoryId: this.CategoryId
    }

  };

  public formStoreSubCategories: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    categoryId: ['', [Validators.required]],
  });

  public formEditSubCategories: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    name: ['', [Validators.required]],
    categoryId: ['', [Validators.required]],
  });
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  @ViewChild('modalStoreSubCategory', { static: true }) modalStoreSubCategory!: TemplateRef<any>;
  @ViewChild('inputTerm') inputTerm!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.getSubCategories();
    this.getCategories();
    // this.getBrands();
  }

  openStoreModal() {
    this.modal.open(this.modalStoreSubCategory, { size: 'lg' });
  }

  search(term: string) {
    console.log("Método search llamado desde el componente");
    this._term = term;
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      term: term
    };
    this.getSubCategories();
    console.log("SE obtuvo");
  }

  getSubCategories() {
    this.subcategoriesService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.paginationService.pagination$.next(pagination);
        this.subcategories = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });

  }

  getCategories() {
    this._categoriesService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.categories = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  store() {
    this.isLoading = true;
    if (this.formStoreSubCategories.invalid) {
      this.isLoading = false;
      this.formStoreSubCategories.markAllAsTouched();
      return;
    }
    let formStoreSubCategories = this.formStoreSubCategories.value;
    console.log(formStoreSubCategories);
    this.subcategoriesService.store(formStoreSubCategories).subscribe({

      next: (resp) => {
        console.log("yaquedo")
        console.log(resp);
        this.getSubCategories();
        this.modal.dismissAll(this.modalStoreSubCategory);
        this.toastService.showToast({
          message: `La sub categoria ${resp.name} se agregó exitosamente`,
          state: 'success'
        });
      },

      error(err) {
        console.log("Valio burguer")
      },
    });
  }

  update() {
    this.isLoading = true;
    if (this.formEditSubCategories.invalid) {
      this.isLoading = false;
      this.formEditSubCategories.markAllAsTouched();
      return;
    }
    let formEditSubCategories = this.formEditSubCategories.value;
    if (this.selectedSubCategory) {
      this.subcategoriesService.update(this.selectedSubCategory.id, formEditSubCategories).subscribe({
        next: (resp) => {
          console.log(resp);
          this.getSubCategories();
          this.modal.dismissAll(this.modalContent);
          this.toastService.showToast({
            message: `La sub categoria ${resp.name} se actualizó exitosamente`,
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
        if (this.selectedSubCategory) {
          this.subcategoriesService.delete(this.selectedSubCategory.id).subscribe({
            next: (resp) => {
              console.log(resp);
              this.getSubCategories();
              this.selectedSubCategory = null;
              this.toastService.showToast({
                message: `La sub categoria ${resp.name} se eliminó exitosamente`,
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
  selectSubCategory(subcategory: SubCategory) {
    console.log(subcategory);

    this.subCategoryName.emit(subcategory.name); //se utilizo para seleccionarlo
    this.selectedSubCategory = subcategory;

  }

  handleDoubleClick(subcategory: SubCategory) {
    console.log(subcategory);
    this.formEditSubCategories.setValue({
      id: subcategory.id,
      name: subcategory.name,
      categoryId: subcategory.categoryId
    });
    this.modal.open(this.modalContent, { size: 'lg' });

  }

  selectBrands(brand: Brand) {
    // Verificar si el componente ya está en la lista de componentes seleccionados
    let existItem = this.selectedBrands.some(
      (mt) => mt.id == brand.id
    );
    console.log(existItem);

    // Si el componente ya existe en la lista, mostrar un mensaje de advertencia y salir
    if (existItem) {
      this.toastService.showToast({
        message: `La marca ${brand.name} ya existe.`,
        state: 'danger',
      });
      return;
    }

    this.selectedBrand = brand;
    // Ocultar la lista de componentes disponibles
    this.showBrandList = false;
  }

  selectBrandsFromKeyboard() {
    if (this.selectedIndex !== -1) {
      const selectBrands = this.brands[this.selectedIndex];
      this.selectBrands(selectBrands);
    }
  }

  // selectHingeComponentTable(hingeHingeComponent: BrandSubCategory) {
  //   console.log(hingeHingeComponent);

  //   this.selectedHingeComponent = hingeHingeComponent;
  // }

  navigateUp() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  searchText(e: any) {
    this.term = e.target.value;
  }

  showBrands(brand: Brand[]) {
    this.brands = brand;
  }

  navigateDown() {
    if (this.selectedIndex < this.brands.length - 1) {
      this.selectedIndex++;
    }
  }
}

