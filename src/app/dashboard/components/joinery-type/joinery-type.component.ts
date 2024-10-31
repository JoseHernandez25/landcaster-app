import {
  Component,
  EventEmitter,
  Output,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { PaginateParameters } from '../../../interfaces/pagination.interface';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  NgbModal,
  NgbModalModule,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ValidatorService } from '../../../services/validator.service';
import { ConfirmationModalService } from '../../../shared/services/confirmation-modal.service';
import { ToastService } from '../../../shared/services/toast.service';
import { JoineryTypeService } from '../../services/joinery-type.service';
import { JoinerieType, Joinery } from '../../../interfaces/models/joinery.interface';
import { JoineryService } from '../../services/joinery.service';
import { FilterJoineryeTypePipe } from '../../../pipes/filte-joinerye-type.pipe';

@Component({
  selector: 'app-joinery-type',
  standalone: true,
  imports: [
    CommonModule,
    PaginationComponent,
    ReactiveFormsModule,
    NgbModalModule,
    FilterJoineryeTypePipe
  ],
  templateUrl: './joinery-type.component.html',
  styleUrl: './joinery-type.component.scss',
})
export class JoineryTypeComponent {
  @Output() joineryeTypeName = new EventEmitter<string>();
  
  public _term: string = '';
  public joineryType: any[] = [];
  public joineries: any[] = [];
  public joineryDetail: any[] = [];
  public selectedJoinery: any[] = [];


  public selectedIndex: number = -1;
  public searchtext: any;
  public selectedJoineryeType: JoinerieType | null = null;
  private _joineryTypeService = inject(JoineryTypeService);
  private _joinery = inject(JoineryService);
  public paginationService = inject(PaginationService);
  private formBuilder = inject(FormBuilder);
  public isLoading: boolean = false;
  private toastService = inject(ToastService);
  private modal = inject(NgbModal)
  public validatorService = inject(ValidatorService);
  private confirmationModalService = inject(ConfirmationModalService);
  public selectedJoinerye!: Joinery;



  @ViewChild('modalStoreJoineryType', { static: true }) modalStoreJoineryType!: TemplateRef<any>;
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  public paginateParametersJ: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'joineries',
    params: {
      term: ''
    },
  };

  public paginateParameters: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'joinerytypes',
    params: {
      term: this._term,
    },
  };

  public formStoreJoineryType: FormGroup = this.formBuilder.group({
    code: [],
    name: ['', [Validators.required]],
    joineryId: [''],
    
  });

  public formEditJoineryType: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    name: ['', [Validators.required]],
    joineryId: [''],
});

  constructor() {}

  ngOnInit(): void {
   
    this.getJoineryType();
    this.getJoinery();
  }

  openStoreModal() {
    this.modal.open(this.modalStoreJoineryType, { size: 'lg' });
  }

  search(term: string) {
    this._term = term;
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      term: term
    };
    this.getJoineryType();
  }

  navigateUp() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  navigateDown() {
    if (this.selectedIndex < this.joineries.length - 1) {
      this.selectedIndex++;
    }
  }

  selectJoineryFromKeyboard() {
    if (this.selectedIndex !== -1) {
      const selectedJoinery = this.joineries[this.selectedIndex];
      this.selectJoinery(selectedJoinery);
    }
  }

  openJoinery(joinery: Joinery[]) {
    this.joineryDetail = joinery;
    console.log( this.joineryDetail);
    
  }

  handleDoubleClick(joinerytype: JoinerieType) {
    console.log(joinerytype);
    this.formEditJoineryType.setValue({
      id: joinerytype.id,
      name: joinerytype.name,
      joineryId: joinerytype.joineries
    });
    this.modal.open(this.modalContent, { size: 'lg' });
    

  }

  selectJoineryType(joinerytype: JoinerieType) {
    this.selectedJoineryeType = joinerytype;
    this.joineryeTypeName.emit(joinerytype.name);
  }

  store() {
    this.isLoading = true;
    if (this.formStoreJoineryType.invalid) {
      this.isLoading = false;
      this.formStoreJoineryType.markAllAsTouched();
      return;
    }
    const nameValue = this.formStoreJoineryType.get('name')?.value;
    let JoneryesIds = this.selectedJoinery.map(
      (joinery) => joinery.id
    );

    const requestBody = {
      joineryType: {
        name: nameValue,
      },
      joineryIds: JoneryesIds
    };
    console.log(requestBody)

    this._joineryTypeService.store(requestBody).subscribe({
      next: (resp) => {
        console.log('Delete response:', resp);

        this.modal.dismissAll(this.modalStoreJoineryType);
        this.toastService.showToast({
          message: `El Subtipo de Armado ${resp.name} se agregó exitosamente`,
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
    if (this.formEditJoineryType.invalid) {
      this.isLoading = false;
      this.formEditJoineryType.markAllAsTouched();
      return;
    }
    let formEditJoineryType = this.formEditJoineryType.value;
    if (this.selectedJoineryeType) {
      this._joineryTypeService
        .update(this.selectedJoineryeType.id, formEditJoineryType)
        .subscribe({
          next: (resp) => {
            console.log(resp);
            this.getJoineryType();
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
        if (this.selectedJoineryeType) {
          this._joineryTypeService.delete(this.selectedJoineryeType.id).subscribe({
            next: (resp) => {
              console.log(resp);
              this.getJoineryType();
              this.selectedJoineryeType = null;
              this.toastService.showToast({
                message: `El tipo armado ${resp.name} se eliminó exitosamente`,
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

  getJoineryType() {
    this._joineryTypeService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.paginationService.pagination$.next(pagination);
        this.joineryType = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
}

getJoinery() {
  this._joinery.get(this.paginateParametersJ).subscribe({
    next: (pagination) => {
      
      this.joineries = pagination.data;
    },
    error: (err) => {
      console.log(err);
    },
  });
}
selectJoinery(joinery: Joinery) {
  let existItem = this.selectedJoinery.some(
    (mt) => mt.id == joinery.id
  );
  console.log(existItem);

  if (existItem) {
    this.toastService.showToast({
      message: `El ${joinery.name} ya existe.`,
      state: 'danger',
    });
    return;
  }
  this.selectedJoinery.push(joinery);
}
deleteSelectedJoinery(index: number) {
  this.selectedJoinery.splice(index, 1); // Usa splice() para eliminar el elemento en el índice dado
  console.log(this.selectedJoinery);
}

}
