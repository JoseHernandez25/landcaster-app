import { Category } from './../../../interfaces/models/category.interface';
import { Component, EventEmitter, Output, TemplateRef, ViewChild, ElementRef, inject } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PaginateParameters, Pagination } from '../../../interfaces/pagination.interface';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorService } from '../../../services/validator.service';
import { ConfirmationModalService } from '../../../shared/services/confirmation-modal.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-categories-tab',
  standalone: true,
  imports: [ReactiveFormsModule, PaginationComponent, CommonModule, NgbModalModule],
  templateUrl: './categories-tab.component.html',
  styleUrl: './categories-tab.component.scss'
})
export class CategoriesTabComponent {
  @Output() categoryName = new EventEmitter<string>();  //se utilizo para seleccionarlo
  public categories: any[] = [];
  private categoriesService = inject(CategoriesService);
  public paginationService = inject(PaginationService);
  private _term: string = '';
  private modal = inject(NgbModal)
  public isLoading: boolean = false;
  public selectedCategory: Category | null = null;
  private formBuilder = inject(FormBuilder);
  public validatorService = inject(ValidatorService);
  private confirmationModalService = inject(ConfirmationModalService);
  private toastService = inject(ToastService);
  public paginateParameters: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'categories',
    params: {
      term: this._term
    }
  };

  public formStoreCategories: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]]
  });

  public formEditCategories: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    name: ['', [Validators.required]],
  });
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  @ViewChild('modalStoreCategory', { static: true }) modalStoreCategory!: TemplateRef<any>;
  @ViewChild('inputTerm') inputTerm!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.getCategories();
  }
  
  openStoreModal() {
    this.modal.open(this.modalStoreCategory, { size: 'lg' });
  }

  // search(event: any) {
  //   console.log("Método search llamado desde el componente");
  //   this.term = event.target.value;
  //   this.paginateParameters.params = {
  //     ...this.paginateParameters.params,
  //     term: this.term
  //   };
  //   this.getCategories();
  //   console.log("SE obtuvo");

  // }

  search(term: string) {
    console.log("Método search llamado desde el componente");
    this._term = term;
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      term: term
    };
    this.getCategories();
    console.log("SE obtuvo");
  }

store() {
  this.isLoading = true;
  if (this.formStoreCategories.invalid) {
    this.isLoading = false;
    this.formStoreCategories.markAllAsTouched();
    return;
  }
  let formStoreCategories = this.formStoreCategories.value;
  console.log(formStoreCategories);
  this.categoriesService.store(formStoreCategories).subscribe({
    next: (resp) => {
      console.log(resp);
      this.getCategories();
      this.modal.dismissAll(this.modalStoreCategory);
      this.toastService.showToast({
        message: `La categoria ${resp.name} se agregó exitosamente`,
        state: 'success'
      });
    },
    error(err) {
    },
  });
}

update() {
  this.isLoading = true;
  if (this.formEditCategories.invalid) {
    this.isLoading = false;
    this.formEditCategories.markAllAsTouched();
    return;
  }
  let formEditCategories = this.formEditCategories.value;
  if (this.selectedCategory) {
    this.categoriesService.update(this.selectedCategory.id, formEditCategories).subscribe({
      next: (resp) => {
        console.log(resp);
        this.getCategories();
        this.modal.dismissAll(this.modalContent);
        this.toastService.showToast({
          message: `La categoria ${resp.name} se actualizó exitosamente`,
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
      if (this.selectedCategory) {
        this.categoriesService.delete(this.selectedCategory.id).subscribe({
          next: (resp) => {
            console.log(resp);
            this.getCategories();
            this.selectedCategory = null;
            this.toastService.showToast({
              message: `La categoria ${resp.name} se eliminó exitosamente`,
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

getCategories() {
  this.categoriesService.get(this.paginateParameters).subscribe({
    next: (pagination) => {
      console.log(pagination);
      this.paginationService.pagination$.next(pagination);
      this.categories = pagination.data;
    },
    error: (err) => {
      console.log(err);
    },
  });

  }
  
  selectCategory(category: Category) {
    console.log(category);

    this.categoryName.emit(category.name); //se utilizo para seleccionarlo
    this.selectedCategory = category;

  }

  handleDoubleClick(category: Category) {
    console.log(category);
    this.formEditCategories.setValue({
      id: category.id,
      name: category.name,

    });
    this.modal.open(this.modalContent, { size: 'lg' });

  }
}