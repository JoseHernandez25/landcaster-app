import { Component, EventEmitter, Output, TemplateRef, ViewChild, inject } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { PaginateParameters } from '../../../interfaces/pagination.interface';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorService } from '../../../services/validator.service';
import { ConfirmationModalService } from '../../../shared/services/confirmation-modal.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Material } from '../../../interfaces/models/material.interface';
import { MaterialtypesService } from '../../services/materialtypes.service';
import { SubtypematerialsService } from '../../services/subtypematerials.service';

@Component({
  selector: 'app-material-section',
  standalone: true,
  imports: [CommonModule, PaginationComponent, ReactiveFormsModule, NgbModalModule],
  templateUrl: './material-section.component.html',
  styleUrl: './material-section.component.scss'
})
export class MaterialSectionComponent {
  @Output() materialName = new EventEmitter<string>(); //se utilizo para seleccionarlo

  public materials: any[] = [];
  public materialTypes: any[] = [];
  public subTypeMaterials: any[] = [];

  private _term: string = '';
  public selectedMaterial: Material | null = null;
  private _materialsService = inject(MaterialService);
  private _materialtypesService = inject(MaterialtypesService);
  public _subtypematerialService = inject(SubtypematerialsService);
  public paginationService = inject(PaginationService);
  private modal = inject(NgbModal)
  public validatorService = inject(ValidatorService);
  private confirmationModalService = inject(ConfirmationModalService);
  public isLoading: boolean = false;
  private toastService = inject(ToastService);
  private formBuilder = inject(FormBuilder);

  @ViewChild('modalStoreMaterial', { static: true }) modalStoreMaterial!: TemplateRef<any>;
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  public paginateParametersMat: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'materialtypes',
    params: {
      term: ''
    }
  };

  public paginateParametersSub: PaginateParameters = {
    page_size: 100,
    page: 1,
    urlPrefix: 'subtypematerials',
    params: {
      term: ''
    }
  };

  public paginateParameters: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'materials',
    params: {
      term: this._term
    }
  };

  public formStoreMaterial: FormGroup = this.formBuilder.group({
    code: [],
    name: ['', [Validators.required]],
    materialTypeId: ['', [Validators.required]],
    subTypeMaterialId: ['', [Validators.required]],
    description: [''],
    weightPerM2: [''],
    subGroupId: [''],


  });

  public formEditMaterial: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    name: ['', [Validators.required]],
    materialTypeId: [''],
    subTypeMaterialId: [''],
    description: [''],
    weightPerM2: [''],
    subGroupId: [''],
    
});

  constructor() { }

  ngOnInit(): void {
   
    this.getMaterial();
    this.getMaterialTypes();
    this.getsubtypematerial();
  }

  openStoreModal() {
    this.modal.open(this.modalStoreMaterial, { size: 'lg' });
  }


  search(term: string) {
    this._term = term;
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      term: term
    };
    this.getMaterial();
  }

  handleDoubleClick(material: Material) {
    console.log(material);
    this.formEditMaterial.setValue({
      id: material.id,
      name: material.name,
      materialTypeId: material.materialTypeId,
      subTypeMaterialId: material.subTypeMaterialId,
      description: material.description,
      weightPerM2: material.weightPerM2,
      subGroupId: material.subGroupId
    });
    this.modal.open(this.modalContent, { size: 'lg' });
    

  }

  selectMaterial(material: Material) {
    this.selectedMaterial = material;
    this.materialName.emit(material.name);
  }

  store() {
    console.log("llamando");

    this.isLoading = true;
    if (this.formStoreMaterial.invalid) {
      this.isLoading = false;
      this.formStoreMaterial.markAllAsTouched();
      return;
    }
    let formStoreMaterial = this.formStoreMaterial.value;
    

    this._materialsService.store(formStoreMaterial).subscribe({
      next: (resp) => {
        console.log(resp);
        this.getMaterial();
        this.modal.dismissAll(this.modalStoreMaterial);
        this.toastService.showToast({
          message: `El Material ${resp.name} se agregó exitosamente`,
          state: 'success'
        });
      },
      error(err) {
        // handle error
      },
    });
  }

  update() {
    this.isLoading = true;
    if (this.formEditMaterial.invalid) {
      this.isLoading = false;
      this.formEditMaterial.markAllAsTouched();
      return;
    }
    let formEditMaterial = this.formEditMaterial.value;
    if (this.selectedMaterial) {
      this._materialsService
        .update(this.selectedMaterial.id, formEditMaterial)
        .subscribe({
          next: (resp) => {
            console.log(resp);
            this.getMaterial();
            this.modal.dismissAll(this.modalContent);
            this.toastService.showToast({
              message: `El Material ${resp.name} se actualizó exitosamente`,
              state: 'success',
            });
          },
          error(err) {},
        });
    }
  }

  delete() {
    const message = '¿Estás seguro de que deseas eliminar este registro?';
    this.confirmationModalService.openConfirmationModal(message).then(confirmed => {
      if (confirmed) {
        this.isLoading = true;
        if (this.selectedMaterial) {
          this._materialsService.delete(this.selectedMaterial.id).subscribe({
            next: (resp) => {
              console.log(resp);
              this.getMaterial();
              this.selectedMaterial = null;
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

  getMaterialTypes() {
    this._materialtypesService.get(this.paginateParametersMat).subscribe({
      next: (pagination) => {
        this.materialTypes = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getsubtypematerial() {
    this._subtypematerialService.get(this.paginateParametersSub).subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.subTypeMaterials = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getMaterial() {
    this._materialsService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        this.paginationService.pagination$.next(pagination);
        this.materials = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });

  }

  
}
