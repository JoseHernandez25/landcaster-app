import { Component, ElementRef, TemplateRef, ViewChild, inject } from '@angular/core';
import { ColorsService } from '../../services/colors.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PaginateParameters, Pagination } from '../../../interfaces/pagination.interface';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { CommonModule } from '@angular/common';
import { Color, SubTypeMaterial } from '../../../interfaces/models/color.interface';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialtypesService } from '../../services/materialtypes.service';
import { ValidatorService } from '../../../services/validator.service';
import { ConfirmationModalService } from '../../../shared/services/confirmation-modal.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-colors',
  standalone: true,
  imports: [ReactiveFormsModule, PaginationComponent, CommonModule, NgbModalModule],
  templateUrl: './colors.component.html',
  styleUrl: './colors.component.scss'
})
export default class ColorsComponent {
  public colors: any[] = [];
  public subTypeMaterials: SubTypeMaterial[] = [];
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  @ViewChild('modalStoreColor', { static: true }) modalStoreColor!: TemplateRef<any>;
  @ViewChild('inputTerm') inputTerm!: ElementRef;
  @ViewChild('selectBrandId') selectBrandId!: ElementRef;
  @ViewChild('selectmaterialTypeId') selectmaterialTypeId!: ElementRef;

  private colorsService = inject(ColorsService);
  private modal = inject(NgbModal)
  public paginationService = inject(PaginationService);
  public term: string = '';
  public brandId: number | string = '';
  public materialTypeId: number | string = '';
  public isLoading: boolean = false;
  public selectedColor: Color | null = null;
  private formBuilder = inject(FormBuilder);
  public validatorService = inject(ValidatorService);
  private confirmationModalService = inject(ConfirmationModalService);
  private toastService = inject(ToastService);
  orderByField: string = '';
  // Variable para rastrear el estado de ordenación actual
  public orderByAsc: boolean = true;
  public withTrashed: any = null;
  public paginateParametersMat: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'materialtypes',
  };
  public materialTypes: any[] = [];
  public brands: any[] = []; 

  public paginateParameters: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'colors',
    params: {
      term: this.term,
      brandId: this.brandId,
      materialTypeId: this.materialTypeId,
      orderByAsc: this.orderByAsc,
      orderBy: this.orderByAsc,
      withTrashed: this.withTrashed
    }
  };
  private _materialtypesService = inject(MaterialtypesService);

  public formStoreColors: FormGroup = this.formBuilder.group({
    code: [],
    supplierCode: [],
    name: ['', [Validators.required]],
    brandId: ['', [Validators.required]],
    materialTypeId: ['', [Validators.required]],
    forDoors: ['true', [Validators.required]],
    forStructure: ['true', [Validators.required]],


  });
  public formEditColors: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    code: [],
    supplierCode: [],
    name: ['', [Validators.required]],
    brandId: ['', [Validators.required]],
    materialTypeId: ['', [Validators.required]],
    forStructure: ['', [Validators.required]],
    forDoors: ['', [Validators.required]],
  });

  constructor() { }

  ngOnInit(): void {
    this.getColors();
    this.getMaterialTypes();
    this.getBrands();
  }
  clearFilter() {
    this.brandId = '';
    this.materialTypeId = '';
    this.term = '';
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      brandId: this.brandId,
      materialTypeId: this.brandId,
      term: this.term

    };
    this.getColors();
    this.inputTerm.nativeElement.value = null;
    this.selectBrandId.nativeElement.value = "";
    this.selectmaterialTypeId.nativeElement.value = "";
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
    this.getColors();
  }

  openStoreModal() {
    this.modal.open(this.modalStoreColor, { size: 'lg' });
  }

  showSubTipesMaterials(subTypeMaterials: SubTypeMaterial[]) {
    console.log(subTypeMaterials);
    this.subTypeMaterials = subTypeMaterials;
  }

  filterByBrand(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    this.brandId = value;
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      brandId: this.brandId
    };
    this.getColors();

  }
  filterByMaterialType(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    this.materialTypeId = value;
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      materialTypeId: this.materialTypeId
    };

    this.getColors();

  }
  filterWithTrashed(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    this.withTrashed = value === 'null' ? null : value;
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      withTrashed: this.withTrashed
    };

    this.getColors();
  }

  search(event: any) {
    this.term = event.target.value;
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      term: this.term
    };

    this.getColors();
  }
  checkColor(color: any, property: string) {
    color[property] = !color[property]; // Alternates between true and false
    console.log(color[property]);
    
    if (property == 'forDoors') {
      this.formEditColors.patchValue({
        id: color.id,
        code: color.code,
        supplierCode: color.supplierCode,
        name: color.name,
        brandId: color.brandId,
        materialTypeId: color.materialTypeId,
        forDoors: color[property],
        forStructure: color.forStructure,
      });
    }
    if (property == 'forStructure') {
      this.formEditColors.patchValue({
        id: color.id,
        code: color.code,
        supplierCode: color.supplierCode,
        name: color.name,
        brandId: color.brandId,
        materialTypeId: color.materialTypeId,
        forStructure: color[property],
        forDoors: color.forDoors,

      });
    }
    console.log(this.formEditColors.value);
    
    this.update();
  }
  getColors() {
    this.colorsService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        this.paginationService.pagination$.next(pagination);
        this.colors = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  handleDoubleClick(color: Color) {
    console.log(color);
    this.formEditColors.setValue({
      id: color.id,
      code: color.code,
      supplierCode: color.supplierCode,
      name: color.name,
      brandId: color.brandId,
      materialTypeId: color.materialTypeId,
      forDoors: color.forDoors,
      forStructure: color.forStructure,
    });
    this.modal.open(this.modalContent, { size: 'lg' });

  }

  selectColor(color: Color) {
    this.selectedColor = color;
  }
  store() {
    this.isLoading = true;
    if (this.formStoreColors.invalid) {
      this.isLoading = false;
      this.formStoreColors.markAllAsTouched();
      return;
    }
    let formStoreColors = this.formStoreColors.value;

    // Convertendo os campos 'forDoors' e 'forStructure' para booleanos
    formStoreColors.forDoors = JSON.parse(formStoreColors.forDoors);
    formStoreColors.forStructure = JSON.parse(formStoreColors.forStructure);

    this.colorsService.store(formStoreColors).subscribe({
      next: (resp) => {
        console.log(resp);
        this.getColors();
        this.modal.dismissAll(this.modalStoreColor);
        this.toastService.showToast({
          message: `El color ${resp.name} se agregó exitosamente`,
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
    if (this.formEditColors.invalid) {
      this.isLoading = false;
      this.formEditColors.markAllAsTouched();
      return;
    }
    let formEditColors = this.formEditColors.value;
    if (this.selectedColor) {
      this.colorsService.update(this.selectedColor.id, formEditColors).subscribe({
        next: (resp) => {
          console.log(resp);
          this.getColors();
          this.modal.dismissAll(this.modalContent);
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
        if (this.selectedColor) {
          this.colorsService.delete(this.selectedColor.id).subscribe({
            next: (resp) => {
              console.log(resp);
              this.getColors();
              this.selectedColor = null;
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
        console.log(pagination);
        this.materialTypes = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getBrands() {
    this.colorsService.getBrands().subscribe({
      next: (brands) => {
        console.log(brands);
        this.brands = brands;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

}
