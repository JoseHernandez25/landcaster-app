import { SubSubCategory } from '../../../interfaces/models/subSubCategory.interface';
import { Component, EventEmitter, Output, TemplateRef, ViewChild, inject } from '@angular/core';
import { SubSubCategoriesService } from '../../services/sub-sub-categories.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PaginateParameters, Pagination } from '../../../interfaces/pagination.interface';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorService } from '../../../services/validator.service';
import { ConfirmationModalService } from '../../../shared/services/confirmation-modal.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SubCategoriesService } from '../../services/sub-categories.service';
@Component({
  selector: 'app-sub-sub-categories',
  standalone: true,
  imports: [ReactiveFormsModule, PaginationComponent, CommonModule, NgbModalModule],
  templateUrl: './sub-sub-categories.component.html',
  styleUrl: './sub-sub-categories.component.scss'
})
export class SubSubCategoriesComponent {
  @Output() subSubCategoryName = new EventEmitter<string>();  //se utilizo para seleccionarlo
  public subcategories: any[] = [];
  public subsubcategories: any[] = [];
  private subsubcategoriesService = inject(SubSubCategoriesService);
  public paginationService = inject(PaginationService);
  private _term: string = '';
  private modal = inject(NgbModal)
  public isLoading: boolean = false;
  public SubCategoryId: number | string = '';
  public selectedSubSubCategory: SubSubCategory | null = null;
  private formBuilder = inject(FormBuilder);
  public validatorService = inject(ValidatorService);
  private confirmationModalService = inject(ConfirmationModalService);
  private toastService = inject(ToastService);
  private subcategoriesService = inject(SubCategoriesService);

  public paginateParameters: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'subsubcategories',
    params: {
      term: this._term,
      SubcategoryId: this.SubCategoryId

    }
  };

  public formStoreSubSubCategories: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    SubcategoryId: ['', [Validators.required]]
  });

  public formEditSubSubCategories: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    name: ['', [Validators.required]],
    SubcategoryId: ['', [Validators.required]]
  });
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  @ViewChild('modalStoreSubSubCategory', { static: true }) modalStoreSubSubCategory!: TemplateRef<any>;
  constructor() { }

  ngOnInit(): void {
    this.getSubSubCategories();
    this.getSubCategories();
  }

  openStoreModal() {
    this.modal.open(this.modalStoreSubSubCategory, { size: 'lg' });
  }

  search(term: string) {
    console.log("Método search llamado desde el componente");
    this._term = term;
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      term: term
    };
    this.getSubSubCategories();
    console.log("SE obtuvo");
  }

  getSubSubCategories() {
    this.subsubcategoriesService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.paginationService.pagination$.next(pagination);
        this.subsubcategories = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });

  }

  store() {
    this.isLoading = true;
    if (this.formStoreSubSubCategories.invalid) {
      this.isLoading = false;
      this.formStoreSubSubCategories.markAllAsTouched();
      return;
    }
    let formStoreSubSubCategories = this.formStoreSubSubCategories.value;
    console.log(formStoreSubSubCategories);
    this.subsubcategoriesService.store(formStoreSubSubCategories).subscribe({
      next: (resp) => {
        console.log(resp);
        this.getSubSubCategories();
        this.modal.dismissAll(this.modalStoreSubSubCategory);
        this.toastService.showToast({
          message: `La sub subcategoria ${resp.name} se agregó exitosamente`,
          state: 'success'
        });
      },
      error(err) {

      },
    });
  }

  update() {
    this.isLoading = true;
    if (this.formEditSubSubCategories.invalid) {
      this.isLoading = false;
      this.formEditSubSubCategories.markAllAsTouched();
      return;
    }
    let formEditSubSubCategories = this.formEditSubSubCategories.value;
    if (this.selectedSubSubCategory) {
      this.subsubcategoriesService.update(this.selectedSubSubCategory.id, formEditSubSubCategories).subscribe({
        next: (resp) => {
          console.log(resp);
          this.getSubSubCategories();
          this.modal.dismissAll(this.modalContent);
          this.toastService.showToast({
            message: `La sub subcategoria ${resp.name} se actualizó exitosamente`,
            state: 'success'
          });
        },
        error(err) {

        },
      });
    }
  }

  getSubCategories() {
    this.subcategoriesService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.subcategories = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });

  }

  delete() {
    const message = '¿Estás seguro de que deseas eliminar este registro?';
    this.confirmationModalService.openConfirmationModal(message).then(confirmed => {
      if (confirmed) {
        this.isLoading = true;
        if (this.selectedSubSubCategory) {
          this.subsubcategoriesService.delete(this.selectedSubSubCategory.id).subscribe({
            next: (resp) => {
              console.log(resp);
              this.getSubSubCategories();
              this.selectedSubSubCategory = null;
              this.toastService.showToast({
                message: `La sub subcategoria ${resp.name} se eliminó exitosamente`,
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
  selectSubSubCategory(subsubcategory: SubSubCategory) {
    console.log(subsubcategory);

    this.subSubCategoryName.emit(subsubcategory.name); //se utilizo para seleccionarlo
    this.selectedSubSubCategory = subsubcategory;

  }

  handleDoubleClick(subsubcategory: SubSubCategory) {
    console.log(subsubcategory);
    this.formEditSubSubCategories.setValue({
      id: subsubcategory.id,
      name: subsubcategory.name,
      SubcategoryId: subsubcategory.subCategoryId,
    })
    this.modal.open(this.modalContent, { size: 'lg' });

  }

}