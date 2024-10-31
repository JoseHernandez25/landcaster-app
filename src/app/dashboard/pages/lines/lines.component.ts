import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { PaginateParameters } from '../../../interfaces/pagination.interface';
import { LinesService } from '../../services/lines.service';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { Line } from '../../../interfaces/models/line.interface';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorService } from '../../../services/validator.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ConfirmationModalService } from '../../../shared/services/confirmation-modal.service';

@Component({
  selector: 'app-lines',
  standalone: true,
  imports: [PaginationComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './lines.component.html',
  styleUrl: './lines.component.scss'
})
export default class LinesComponent {
  @ViewChild('modalUpdate', { static: true }) modalUpdate!: TemplateRef<any>;
  @ViewChild('modalStore', { static: true }) modalStore!: TemplateRef<any>;


  private linesService = inject(LinesService);
  private paginationService = inject(PaginationService);
  private formBuilder = inject(FormBuilder);
  private modal = inject(NgbModal);
  private toastService = inject(ToastService);
  private confirmationModalService = inject(ConfirmationModalService);

  public validatorService = inject(ValidatorService);

  public lines: Line[] = [];
  public orderByField: string = '';
  public term: string = '';
  public orderByAsc: boolean = true;
  public selectedLine: Line | null = null;
  public isLoading = false;
  public paginateParameters: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'lines',
    params: {
      term: this.term,
      orderByAsc: this.orderByAsc,
      orderBy: this.orderByAsc,
    }
  };

  public formStoreLine: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
  });


  public formEditLine: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    name: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.getLines();
    this.paginationService.pagination$.subscribe({
      next: (value) => {
        this.lines = value.data;
      },
    });
  }

  getLines() {
    this.linesService.get(this.paginateParameters).subscribe({
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
    this.getLines();
  }
  search(event: any) {
    this.term = event.target.value;
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      term: this.term
    };
    // this.paginateParameters.page = 1;

    this.getLines();
  }

  handleDoubleClick(line: Line) {
    this.formEditLine.setValue({
      id: line.id,
      name: line.name,
    });
    this.modal.open(this.modalUpdate, { size: 'lg' });

  }

  selectColor(line: Line) {
    this.selectedLine = line;
  }

  openStoreModal() {
    this.modal.open(this.modalStore, { size: 'lg' });
  }
  store() {
    this.isLoading = true;
    if (this.formStoreLine.invalid) {
      this.isLoading = false;
      this.formStoreLine.markAllAsTouched();
      return;
    }
    let formStoreLine = this.formStoreLine.value;
    this.linesService.store(formStoreLine).subscribe({
      next: (resp) => {
        console.log(resp);
        this.getLines();
        this.modal.dismissAll(this.modalUpdate);
        this.toastService.showToast({
          message: `El color ${resp.name} se agregó exitosamente`,
          state: 'success'
        });
        this.formStoreLine.reset();
      },
      error(err) {

      },
    });
  }

  update() {
    this.isLoading = true;
    if (this.formEditLine.invalid) {
      this.isLoading = false;
      this.formEditLine.markAllAsTouched();
      return;
    }
    let formEditLine = this.formEditLine.value;
    if (this.selectedLine) {
      this.linesService.update(this.selectedLine.id, formEditLine).subscribe({
        next: (resp) => {
          console.log(resp);
          this.getLines();
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
        if (this.selectedLine) {
          this.linesService.delete(this.selectedLine.id).subscribe({
            next: (resp) => {
              console.log(resp);
              this.getLines();
              this.selectedLine = null;
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

