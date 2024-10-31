import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, inject, output } from '@angular/core';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { MaterialtypesService } from '../../services/materialtypes.service';
import { PaginateParameters, Pagination } from '../../../interfaces/pagination.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorService } from '../../../services/validator.service';
import { MaterialType } from '../../../interfaces/models/color.interface';
import { ConfirmationModalService } from '../../../shared/services/confirmation-modal.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SubTypeMaterial } from '../../../interfaces/models/subTypeMaterial.interface';
import { SubtypematerialsService } from '../../services/subtypematerials.service';


@Component({
  selector: 'app-materials-types',
  standalone: true,
  imports: [PaginationComponent, CommonModule,ReactiveFormsModule,NgbModalModule],
  templateUrl: './materials-types.component.html',
  styleUrl: './materials-types.component.scss'
})
export class MaterialsTypesComponent {
  @Output() materialTypeName = new EventEmitter<string>();  //se utilizo para seleccionarlo

  public materialsTypes: any[] = [];
  public subtypematerials: any[] = [];
  private _term: string = '';
  private materialtypesService = inject(MaterialtypesService);
  private subtypematerialService = inject(SubtypematerialsService);
  public paginationService = inject(PaginationService);
  private formBuilder = inject(FormBuilder);
  public selectedMaterialType: MaterialType | null = null;
  private modal = inject(NgbModal)
  public validatorService = inject(ValidatorService);
  private confirmationModalService = inject(ConfirmationModalService);
  public isLoading: boolean = false;
  private toastService = inject(ToastService);

  @ViewChild('modalStoreMaterialType', { static: true }) modalStoreMaterialType!: TemplateRef<any>;
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  
  public paginateParametersMat: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'subtypematerials',
    params: {
      term: ''
    }
  };
  

  public paginateParameters: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'materialtypes',
    params: {
      term: this._term
    }
  };

  public formStoreMaterialType: FormGroup = this.formBuilder.group({
    code: [],
    name: ['', [Validators.required]],
    hasbarniz: [false, [Validators.required]],
    

  });
  public formEditMaterialType: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    name: ['', [Validators.required]],
    hasbarniz: [, [Validators.required]],
    
});


  constructor() { }

  ngOnInit(): void {
    this.paginationService.pagination$.subscribe(pagination => {
      this.materialsTypes = pagination.data;
    })
    this.getmaterialtype();
  }

  openStoreModal() {
    this.modal.open(this.modalStoreMaterialType, { size: 'lg' });
  }

  search(term: string) {
    this._term = term;
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      term: term
    };
    this.getmaterialtype();
    
  }

  openSubTypeMaterial(subTypeMaterial: SubTypeMaterial[]) {
    this.subtypematerials = subTypeMaterial;
    console.log( this.subtypematerials);
    
  }

  getmaterialtype() {
    this.materialtypesService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.paginationService.pagination$.next(pagination);
        this.materialsTypes = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
    

  }

  handleDoubleClick(materialtype: MaterialType) {
    console.log(materialtype);
    this.formEditMaterialType.setValue({
      id: materialtype.id,
      hasbarniz: materialtype.hasBarniz,
      name: materialtype.name,
      

    });
    this.modal.open(this.modalContent, { size: 'lg' });
    

  }

  selectMaterialType(materialtype: MaterialType) {
    console.log(materialtype);
    
    this.selectedMaterialType = materialtype;
    this.materialTypeName.emit(materialtype.name); //se utilizo para seleccionarlo
  }

  store() {
    console.log("llamando");
    this.isLoading = true;
    if (this.formStoreMaterialType.invalid) {
      this.isLoading = false;
      this.formStoreMaterialType.markAllAsTouched();
      return;
    }
    let formStoreMaterialType = this.formStoreMaterialType.value;
    this.materialtypesService.store(formStoreMaterialType).subscribe({
      next: (resp) => {
        console.log("Delete response:", resp);
        this.getmaterialtype();
        this.modal.dismissAll(this.modalStoreMaterialType);
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
    if (this.formEditMaterialType.invalid) {
      this.isLoading = false;
      this.formEditMaterialType.markAllAsTouched();
      return;
    }
    let formEditMaterialType = this.formEditMaterialType.value;
    if (this.selectedMaterialType) {
      this.materialtypesService.update(this.selectedMaterialType.id, formEditMaterialType).subscribe({
        next: (resp) => {
          console.log(resp);
          this.getmaterialtype();
          this.modal.dismissAll(this.modalContent);
          this.toastService.showToast({
            message: `La clase ${resp.name} se actualizó exitosamente`,
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
        if (this.selectedMaterialType) {
          this.materialtypesService.delete(this.selectedMaterialType.id).subscribe({
            next: (resp) => {
              console.log(resp);
              this.getmaterialtype();
              this.selectedMaterialType = null;
              this.toastService.showToast({
                message: `La clase material ${resp.name} se eliminó exitosamente`,
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
