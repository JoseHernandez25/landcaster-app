import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../shared/services/toast.service';
import { ConfirmationModalService } from '../../../shared/services/confirmation-modal.service';
import { ValidatorService } from '../../../services/validator.service';
import { PaginateParameters } from '../../../interfaces/pagination.interface';
import { AreasService } from '../../services/areas.service';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';

@Component({
  selector: 'app-areas',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PaginationComponent],
  templateUrl: './areas.component.html',
  styleUrl: './areas.component.scss'
})
export default class AreasComponent {
  @ViewChild('modalUpdate', { static: true }) modalUpdate!: TemplateRef<any>;
  @ViewChild('modalStore', { static: true }) modalStore!: TemplateRef<any>;


  private areasService = inject(AreasService);
  private paginationService = inject(PaginationService);
  private formBuilder = inject(FormBuilder);
  private modal = inject(NgbModal);
  private toastService = inject(ToastService);
  private confirmationModalService = inject(ConfirmationModalService);

  public validatorService = inject(ValidatorService);

  public areas: any[] = [];
  public orderByField: string = '';
  public term: string = '';
  public orderByAsc: boolean = true;
  public selectedArea: any | null = null;
  public isLoading = false;
  public paginateParameters: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'areas',
    params: {
      term: this.term,
      orderByAsc: this.orderByAsc,
      orderBy: this.orderByAsc,
    }
  };

  public formStoreArea: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
  });


  public formEditArea: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    name: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.getAreas();
    this.paginationService.pagination$.subscribe({
      next: (value) => {
        this.areas = value.data;
      },
    });
  }

  getAreas() {
    this.areasService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.paginationService.pagination$.next(pagination);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  orderBy(field: string) {
    // Si se hace clic en el mismo campo de ordenación, cambiar el estado de ordenación
    if (this.orderByField === field) {
      this.orderByAsc = !this.orderByAsc;
    } else {
      // Si se hace clic en un nuevo campo de ordenación, establecerlo como el nuevo campo de ordenación y ordenar de forma ascendente
      this.orderByField = field;
      this.orderByAsc = true;
    }

    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      orderByAsc: this.orderByAsc,
      orderBy: field
    };
    console.log(this.paginateParameters);
    this.getAreas();
  }
  search(event: any) {
    this.term = event.target.value;
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      term: this.term
    };
    // this.paginateParameters.page = 1;

    this.getAreas();
  }

  handleDoubleClick(line: any) {
    this.formEditArea.setValue({
      id: line.id,
      name: line.name,
    });
    this.modal.open(this.modalUpdate, { size: 'lg' });

  }

  selectColor(line: any) {
    this.selectedArea = line;
  }

  openStoreModal() {
    this.modal.open(this.modalStore, { size: 'lg' });
  }
  store() {
    this.isLoading = true;
    if (this.formStoreArea.invalid) {
      this.isLoading = false;
      this.formStoreArea.markAllAsTouched();
      return;
    }
    let formStoreArea = this.formStoreArea.value;
    this.areasService.store(formStoreArea).subscribe({
      next: (resp) => {
        console.log(resp);
        this.getAreas();
        this.modal.dismissAll(this.modalUpdate);
        this.toastService.showToast({
          message: `El color ${resp.name} se agregó exitosamente`,
          state: 'success'
        });
        this.formStoreArea.reset();
      },
      error(err) {

      },
    });
  }

  update() {
    this.isLoading = true;
    if (this.formEditArea.invalid) {
      this.isLoading = false;
      this.formEditArea.markAllAsTouched();
      return;
    }
    let formEditArea = this.formEditArea.value;
    if (this.selectedArea) {
      this.areasService.update(this.selectedArea.id, formEditArea).subscribe({
        next: (resp) => {
          console.log(resp);
          this.getAreas();
          this.modal.dismissAll(this.modalUpdate);
          this.toastService.showToast({
            message: `El color ${resp.name} se actualizó exitosamente`,
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
        if (this.selectedArea) {
          this.areasService.delete(this.selectedArea.id).subscribe({
            next: (resp) => {
              console.log(resp);
              this.getAreas();
              this.selectedArea = null;
              this.toastService.showToast({
                message: `La ${resp.name} se eliminó exitosamente`,
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
