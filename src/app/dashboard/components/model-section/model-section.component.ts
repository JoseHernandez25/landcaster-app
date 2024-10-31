import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, inject, output } from '@angular/core';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PaginateParameters, Pagination } from '../../../interfaces/pagination.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorService } from '../../../services/validator.service';
import { ConfirmationModalService } from '../../../shared/services/confirmation-modal.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ModelsService } from '../../services/models.service';
import { Model } from '../../../interfaces/models/model.interface';


@Component({
  selector: 'app-model-section',
  standalone: true,
  imports: [PaginationComponent, CommonModule,ReactiveFormsModule,NgbModalModule],
  templateUrl: './model-section.component.html',
  styleUrl: './model-section.component.scss'
})
export class ModelSectionComponent {
  @Output() modelName = new EventEmitter<string>();  //se utilizo para seleccionarlo

  public isLoading: boolean = false;
  public _term: string = "";
  public models: any[] = [];
  public _modelService = inject(ModelsService);
  public paginationService = inject(PaginationService);
  private formBuilder = inject(FormBuilder);
  private modal = inject(NgbModal)
  private toastService = inject(ToastService);
  public validatorService = inject(ValidatorService);
  public selectedModel: Model | null = null;
  private confirmationModalService = inject(ConfirmationModalService);


  @ViewChild('modalStoreModel', { static: true }) modalStoreModel!: TemplateRef<any>;
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  public paginateParameters: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'models',
    params: {
      term: this._term
    }
  };

  public formStoreModel: FormGroup = this.formBuilder.group({
    code: [],
    name: ['', [Validators.required]],    

  });

  public formEditModel: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    name: ['', [Validators.required]],
    
});

  constructor() { }

  ngOnInit(): void {
    this.paginationService.pagination$.subscribe(pagination => {
      this.models = pagination.data;
      
    })
    this.getmodel();
  }
  
  openStoreModal() {
    this.modal.open(this.modalStoreModel, { size: 'lg' });
  }

  search(term: string) {
    console.log("que hay");
    this._term = term;
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      term: term
    };
    this.getmodel();
    
  }


  getmodel() {
    this._modelService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.paginationService.pagination$.next(pagination);
        this.models = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  handleDoubleClick(model: Model) {
    console.log(model);
    this.formEditModel.setValue({
      id: model.id,
      name: model.name,
    });
    this.modal.open(this.modalContent, { size: 'lg' });
    

  }

  selectModel(model: Model) {
    console.log(model);
    
    this.selectedModel = model;
    this.modelName.emit(model.name); //se utilizo para seleccionarlo
  }

  store() {
    console.log("llamando");
    this.isLoading = true;
    if (this.formStoreModel.invalid) {
      this.isLoading = false;
      this.formStoreModel.markAllAsTouched();
      return;
    }
    let formStoreModel = this.formStoreModel.value;
    this._modelService.store(formStoreModel).subscribe({
      next: (resp) => {
        console.log("Delete response:", resp);
        this.getmodel();
        this.modal.dismissAll(this.modalStoreModel);
        this.toastService.showToast({
          message: `La clase ${resp.name} se agregó exitosamente`,
          state: 'success'
        });
      },
      error(err) {
        console.error("Error while deleting:", err);

      },
    });
  }

  update() {
    this.isLoading = true;
    if (this.formEditModel.invalid) {
      this.isLoading = false;
      this.formEditModel.markAllAsTouched();
      return;
    }
    let formEditModel = this.formEditModel.value;
    if (this.selectedModel) {
      this._modelService.update(this.selectedModel.id, formEditModel).subscribe({
        next: (resp) => {
          console.log(resp);
          this.getmodel();
          this.modal.dismissAll(this.modalContent);
          this.toastService.showToast({
            message: `El Modelo ${resp.name} se actualizó exitosamente`,
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
        if (this.selectedModel) {
          this._modelService.delete(this.selectedModel.id).subscribe({
            next: (resp) => {
              console.log(resp);
              this.getmodel();
              this.selectedModel = null;
              this.toastService.showToast({
                message: `El Modelo ${resp.name} se eliminó exitosamente`,
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
