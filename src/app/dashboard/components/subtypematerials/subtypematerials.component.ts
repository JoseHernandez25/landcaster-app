import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import {
  PaginateParameters,
  Pagination,
} from '../../../interfaces/pagination.interface';
import { CommonModule } from '@angular/common';
import { SubtypematerialsService } from '../../services/subtypematerials.service';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {
FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidatorService } from '../../../services/validator.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ConfirmationModalService } from '../../../shared/services/confirmation-modal.service';
import { SubTypeMaterial } from '../../../interfaces/models/subTypeMaterial.interface';
import { MaterialType } from '../../../interfaces/models/color.interface';
import { MaterialtypesService } from '../../services/materialtypes.service';
import { FilterSubtypeMaterialPipe } from '../../../pipes/filte-subtype-material.pipe';

@Component({
  selector: 'app-subtypematerials',
  standalone: true,
  templateUrl: './subtypematerials.component.html',
  styleUrl: './subtypematerials.component.scss',
  imports: [PaginationComponent, CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    FormsModule,
    FilterSubtypeMaterialPipe,
  ],
})
export class SubtypematerialsComponent {
  @Output() subTypeMaterialName = new EventEmitter<string>(); //se utilizo para seleccionarlo

  public subtypematerials: any[] = [];
  public materialsTypesDetail: any[] = [];
  public materialsTypes: any[] = [];
  public selectedMaterialsTypes: any[] = [];

  public searchtext: any;
  public selectedIndex: number = -1;
  private _term: string = '';
  private _subtypematerialsService = inject(SubtypematerialsService);
  private _materialtypesService = inject(MaterialtypesService);
  public paginationService = inject(PaginationService);
  private formBuilder = inject(FormBuilder);
  public selectedSubTypeMaterial: SubTypeMaterial | null = null;
  private modal = inject(NgbModal);
  public validatorService = inject(ValidatorService);
  private confirmationModalService = inject(ConfirmationModalService);
  public isLoading: boolean = false;
  private toastService = inject(ToastService);
  public selectedMaterialType!: MaterialType; // Define la propiedad aquí

  @ViewChild('modalStoreSubTypeMaterial', { static: true })
  modalStoreSubTypeMaterial!: TemplateRef<any>;
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  public paginateParametersMat: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'materialtypes',
    params: {
      term: ''
    }
  };

  public paginateParameters: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'subtypematerials',
    params: {
      term: this._term,
    },
  };

  public formStoreSubTypeMaterial: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    materialTypeId: [''],
  });

  public formEditSubTypeMaterial: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    name: ['', [Validators.required]],
    materialTypeId: [''],
  });

  constructor() {}

  ngOnInit(): void {
    this.paginationService.pagination$.subscribe((pagination) => {
      this.subtypematerials = pagination.data;
    });
    document.addEventListener('click', this.handleClickOutside.bind(this));
    this.getsubtypematerial();
    this.getMaterialTypes();
  }

  openStoreModal() {
    this.modal.open(this.modalStoreSubTypeMaterial, { size: 'lg' });
  }

  search(term: string) {
    this._term = term; 
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      term: term
    };
    this.getsubtypematerial();
    
  }

  navigateUp() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  navigateDown() {
    if (this.selectedIndex < this.materialsTypes.length - 1) {
      this.selectedIndex++;
    }
  }

  selectMaterialTypeFromKeyboard() {
    if (this.selectedIndex !== -1) {
      const selectedMaterialType = this.materialsTypes[this.selectedIndex];
      this.selectMaterialType(selectedMaterialType);
    }
  }

  openMaterialType(materialType: MaterialType[]) {
    this.materialsTypesDetail = materialType;
  }
  getsubtypematerial() {
    this._subtypematerialsService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        this.paginationService.pagination$.next(pagination);
        //this.materialstypes = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  handleDoubleClick(subtypematerial: SubTypeMaterial) {
    console.log(subtypematerial);
    this.formEditSubTypeMaterial.setValue({
      id: subtypematerial.id,
      name: subtypematerial.name,
      materialTypeId: subtypematerial.materialTypes,
    });
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  handleClickOutside(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    const listContainer = document.querySelector('.list-group.position-absolute');
    if (listContainer && !listContainer.contains(targetElement)) {
        // Si el clic no está dentro del área de la lista, cierra la lista
        this.searchtext = ''; // Esto limpiará el texto de búsqueda y hará que desaparezca la lista
    }
}

  selectSubTypeMaterial(subtypematerial: SubTypeMaterial) {
    console.log(subtypematerial);

    this.selectedSubTypeMaterial = subtypematerial;
    this.subTypeMaterialName.emit(subtypematerial.name); //se utilizo para seleccionarlo
  }

  store() {
    this.isLoading = true;
    if (this.formStoreSubTypeMaterial.invalid) {
      this.isLoading = false;
      this.formStoreSubTypeMaterial.markAllAsTouched();
      return;
    }
    const nameValue = this.formStoreSubTypeMaterial.get('name')?.value;
    let materialsTypesIds = this.selectedMaterialsTypes.map(
      (materialsType) => materialsType.id
    );

    const requestBody = {
      subTypeMaterial: {
        name: nameValue,
      },
      materialTypeIds:materialsTypesIds
    };

    this._subtypematerialsService.store(requestBody).subscribe({
      next: (resp) => {
        console.log('Delete response:', resp);

        this.modal.dismissAll(this.modalStoreSubTypeMaterial);
        this.toastService.showToast({
          message: `La subclase ${resp.name} se agregó exitosamente`,
          state: 'success',
        });
      },
      error(err) {
        console.error('Error while deleting:', err);
      },
    });
  }

  update() {
    this.isLoading = true;
    if (this.formEditSubTypeMaterial.invalid) {
      this.isLoading = false;
      this.formEditSubTypeMaterial.markAllAsTouched();
      return;
    }
    let formEditSubTypeMaterial = this.formEditSubTypeMaterial.value;
    if (this.selectedSubTypeMaterial) {
      this._subtypematerialsService
        .update(this.selectedSubTypeMaterial.id, formEditSubTypeMaterial)
        .subscribe({
          next: (resp) => {
            console.log(resp);
            this.getsubtypematerial();
            this.modal.dismissAll(this.modalContent);
            this.toastService.showToast({
              message: `La subclase ${resp.name} se actualizó exitosamente`,
              state: 'success',
            });
          },
          error(err) {},
        });
    }
  }

  delete() {
    const message = '¿Estás seguro de que deseas eliminar este registro?';
    this.confirmationModalService
      .openConfirmationModal(message)
      .then((confirmed) => {
        if (confirmed) {
          this.isLoading = true;
          if (this.selectedSubTypeMaterial) {
            this._subtypematerialsService
              .delete(this.selectedSubTypeMaterial.id)
              .subscribe({
                next: (resp) => {
                  console.log(resp);
                  this.getsubtypematerial();
                  this.selectedSubTypeMaterial = null;
                  this.toastService.showToast({
                    message: `La subclase ${resp.name} se eliminó exitosamente`,
                    state: 'success',
                  });
                },
                error(err) {},
              });
          }
        }
      });
  }

  getMaterialTypes() {
    this._materialtypesService.get(this.paginateParametersMat).subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.materialsTypes = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  selectMaterialType(materialType: MaterialType) {
    let existItem = this.selectedMaterialsTypes.some(
      (mt) => mt.id == materialType.id
    );
    console.log(existItem);

    if (existItem) {
      this.toastService.showToast({
        message: `El ${materialType.name} ya existe.`,
        state: 'danger',
      });
      return;
    }
    this.selectedMaterialsTypes.push(materialType);
  }

  deleteSelectedMaterialsType(index: number) {
    this.selectedMaterialsTypes.splice(index, 1); // Usa splice() para eliminar el elemento en el índice dado
    console.log(this.selectedMaterialsTypes);
  }
}
