import { Component, EventEmitter, Output, TemplateRef, ViewChild, inject } from '@angular/core';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { PaginateParameters } from '../../../interfaces/pagination.interface';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorService } from '../../../services/validator.service';
import { ConfirmationModalService } from '../../../shared/services/confirmation-modal.service';
import { ToastService } from '../../../shared/services/toast.service';
import { JoineryService } from '../../services/joinery.service';
import { JoinerieType, Joinery } from '../../../interfaces/models/joinery.interface';
import { JoineryTypeService } from '../../services/joinery-type.service';
import { FilterJoineryeSectionPipe } from '../../../pipes/filte-joinerye-section.pipe';

@Component({
  selector: 'app-joinery-section',
  standalone: true,
  imports: [CommonModule, PaginationComponent, ReactiveFormsModule, NgbModalModule, FilterJoineryeSectionPipe],
  templateUrl: './joinery-section.component.html',
  styleUrl: './joinery-section.component.scss'
})
export class JoinerySectionComponent {

  @Output() joineryeName = new EventEmitter<string>();

  public selectedJoinerye: Joinery | null = null;
  private _term: string = '';
  public joinery: any[] = [];
  public joineryTypeDetail: any[] = [];
  public joineryType: any[] = [];
  public selectedJoineryType: any[] = [];
  public selectedIndex: number = -1;
  public searchtext: any;

  private formBuilder = inject(FormBuilder);
  private _joineryService = inject(JoineryService);
  private _JoineryTypeService = inject(JoineryTypeService)
  public paginationService = inject(PaginationService);
  public isLoading: boolean = false;
  private toastService = inject(ToastService);
  private modal = inject(NgbModal)
  public validatorService = inject(ValidatorService);
  private confirmationModalService = inject(ConfirmationModalService);



  @ViewChild('modalStoreJoinery', { static: true }) modalStoreJoinery!: TemplateRef<any>;
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;


  public paginateParametersJ: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'joinerytypes',
    params: {
      term: ''
    },
  };

  public paginateParameters: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'joineries',
    params: {
      term: this._term
    }
  };

  public formStoreJoinery: FormGroup = this.formBuilder.group({
    code: [],
    name: ['', [Validators.required]],
    joineryTypeId: [''],
    
  });

  public formEditJoinery: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    name: ['', [Validators.required]],
    joineryTypeId: [''],
});

  constructor() { }

  ngOnInit(): void {
    this.paginationService.pagination$.subscribe(pagination => {
      this.joinery = pagination.data;
    })
    this.getJoinery();
    this.getJoineryType();
  }

  openStoreModal() {
    this.modal.open(this.modalStoreJoinery, { size: 'lg' });
  }

  search(term: string) {
    this._term = term;
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      term: term,
    };
    this.getJoinery();
  }

  navigateUp() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  navigateDown() {
    if (this.selectedIndex < this.joineryType.length - 1) {
      this.selectedIndex++;
    }
  }

  selectJoineryTypeFromKeyboard() {
    if (this.selectedIndex !== -1) {
      const selectedJoineryType = this.joineryType[this.selectedIndex];
      this.selectJoineryType(selectedJoineryType);
    }
  }

  openJoineryType(joineryType: JoinerieType[]) {
    this.joineryTypeDetail = joineryType;
    console.log( this.joineryTypeDetail);
    
  }
  handleDoubleClick(joinery: Joinery) {
    console.log(joinery);
    this.formEditJoinery.setValue({
      id: joinery.id,
      name: joinery.name,
      joineryTypeId: joinery.joineryTypes
    });
    this.modal.open(this.modalContent, { size: 'lg' });
    

  }

  selectJoinery(joinery: Joinery) {
    this.selectedJoinerye = joinery;
    this.joineryeName.emit(joinery.name);
  }

  store() {
    this.isLoading = true;
    if (this.formStoreJoinery.invalid) {
      this.isLoading = false;
      this.formStoreJoinery.markAllAsTouched();
      return;
    }
    const nameValue = this.formStoreJoinery.get('name')?.value;
    let JoneryTypesIds = this.selectedJoineryType.map(
      (joineryTypes) => joineryTypes.id
    );

    const requestBody = {
      Joinery: {
        name: nameValue,
      },
      joineryTypeIds: JoneryTypesIds
    };

    this._joineryService.store(requestBody).subscribe({
      next: (resp) => {
        console.log('Delete response:', resp);

        this.modal.dismissAll(this.modalStoreJoinery);
        this.toastService.showToast({
          message: `El Armado ${resp.name} se agregó exitosamente`,
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
    if (this.formEditJoinery.invalid) {
      this.isLoading = false;
      this.formEditJoinery.markAllAsTouched();
      return;
    }
    let formEditJoinery = this.formEditJoinery.value;
    if (this.selectedJoinerye) {
      this._joineryService
        .update(this.selectedJoinerye.id, formEditJoinery)
        .subscribe({
          next: (resp) => {
            console.log(resp);
            this.getJoinery();
            this.modal.dismissAll(this.modalContent);
            this.toastService.showToast({
              message: `El Armado ${resp.name} se actualizó exitosamente`,
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
        if (this.selectedJoinerye) {
          this._joineryService.delete(this.selectedJoinerye.id).subscribe({
            next: (resp) => {
              console.log(resp);
              this.getJoinery();
              this.selectedJoinerye = null;
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
  getJoinery() {
    this._joineryService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        console.log(pagination)
        this.paginationService.pagination$.next(pagination);
        this.joinery = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });

  }
  getJoineryType() {
    this._JoineryTypeService.get(this.paginateParametersJ).subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.joineryType = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  selectJoineryType(joineryType: JoinerieType) {
    let existItem = this.selectedJoineryType.some(
      (mt) => mt.id == joineryType.id
    );
    console.log(existItem);
  
    if (existItem) {
      this.toastService.showToast({
        message: `El ${joineryType.name} ya existe.`,
        state: 'danger',
      });
      return;
    }
    this.selectedJoineryType.push(joineryType);
  }
  deleteSelectedJoineryType(index: number) {
    this.selectedJoineryType.splice(index, 1); // Usa splice() para eliminar el elemento en el índice dado
    console.log(this.selectedJoineryType);
  }
}
