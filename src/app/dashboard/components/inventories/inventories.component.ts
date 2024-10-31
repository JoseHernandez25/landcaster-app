import { Inventory } from './../../../interfaces/models/inventory.interface';
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
import { InventoriesService } from '../../services/inventories.service';
import { ProductsService } from '../../services/products.service';


@Component({
  selector: 'app-inventories',
  standalone: true,
  imports: [ReactiveFormsModule, PaginationComponent, CommonModule, NgbModalModule],
  templateUrl: './inventories.component.html',
  styleUrl: './inventories.component.scss'
})
export class InventoriesComponent {
  @Output() inventoryName = new EventEmitter<string>();
  public inventories: any[] = [];
  public products: any [] =[];
  public factories: any [] =[];
  private inventoriesService = inject(InventoriesService);
  public paginationService = inject(PaginationService);
  private _term: string = '';
  private modal = inject(NgbModal)
  public isLoading: boolean = false;
  public selectedInventory: Inventory | null = null;
  private formBuilder = inject(FormBuilder);
  public validatorService = inject(ValidatorService);
  private confirmationModalService = inject(ConfirmationModalService);
  private toastService = inject(ToastService);
  private _productsService = inject(ProductsService);
  public paginateParameters: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'categories',
    params: {
      term: this._term
    }
  };

  public formStoreInventories: FormGroup = this.formBuilder.group({
    stock: ['', [Validators.required]],
    MaximumStock: ['', [Validators.required]],
    MinimumStock: ['', [Validators.required]],
    ProductId: ['', [Validators.required]],
    FactoryId: ['', [Validators.required]],
  });

  public formEditInventories: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    stock: ['', [Validators.required]],
    MaximumStock: ['', [Validators.required]],
    MinimumStock: ['', [Validators.required]],
    ProductId: ['', [Validators.required]],
    FactoryId: ['', [Validators.required]],
  });

  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  @ViewChild('modalStoreInventory', { static: true }) modalStoreInventory!: TemplateRef<any>;
  @ViewChild('inputTerm') inputTerm!: ElementRef;

  ngOnInit(): void {
    this.getInventories();
    this.getProducts();
  }

  getInventories() {
    this.inventoriesService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.paginationService.pagination$.next(pagination);
        this.inventories = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getProducts() {
    this._productsService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.products = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  selectInventory(inventory: Inventory) {
    console.log(inventory);
    // this.inventoryName.emit(inventory.id); //se utilizo para seleccionarlo
    this.selectedInventory = inventory;
  }

  handleDoubleClick(inventory: Inventory) {
    console.log(inventory);
    this.formEditInventories.setValue({
      id: inventory.id,
      stock: inventory.stock,
      MaximumStock: inventory.maximumStock,
      MinimumStock: inventory.minimumStock,
      ProductId: inventory.productId,
      FactoryId: inventory.factoryId,
    });
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  openStoreModal() {
    this.modal.open(this.modalStoreInventory, { size: 'lg' });
  }

  search(term: string) {
    console.log("Método search llamado desde el componente");
    this._term = term;
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      term: term
    };
    this.getInventories();
    console.log("SE obtuvo");
  }

  store() {
    this.isLoading = true;
    if (this.formStoreInventories.invalid) {
      this.isLoading = false;
      this.formStoreInventories.markAllAsTouched();
      return;
    }
    let formStoreInventories = this.formStoreInventories.value;
    console.log(formStoreInventories);
    this.inventoriesService.store(formStoreInventories).subscribe({

      next: (resp) => {
        console.log("yaquedo")
        console.log(resp);
        this.getInventories();
        this.modal.dismissAll(this.modalStoreInventory);
        this.toastService.showToast({
          message: `El producto ${resp.name} se agregó exitosamente`,
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
    if (this.formEditInventories.invalid) {
      this.isLoading = false;
      this.formEditInventories.markAllAsTouched();
      return;
    }
    let formEditInventories = this.formEditInventories.value;
    if (this.selectedInventory) {
      this.inventoriesService.update(this.selectedInventory.id, formEditInventories).subscribe({
        next: (resp) => {
          console.log(resp);
          this.getInventories();
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
        if (this.selectedInventory) {
          this.inventoriesService.delete(this.selectedInventory.id).subscribe({
            next: (resp) => {
              console.log(resp);
              this.getInventories();
              this.selectedInventory = null;
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

}
