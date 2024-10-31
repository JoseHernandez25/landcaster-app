import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../shared/services/toast.service';
import { ConfirmationModalService } from '../../../shared/services/confirmation-modal.service';
import { ValidatorService } from '../../../services/validator.service';
import { CommonModule } from '@angular/common';
import { PaginateParameters } from '../../../interfaces/pagination.interface';
import { RoutesService } from '../../services/routes.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { OrderByPipe } from '../../../pipes/order-by.pipe';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PaginationComponent, OrderByPipe],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.scss'
})
export default class RoutesComponent {
  @ViewChild('modalUpdate', { static: true }) modalUpdate!: TemplateRef<any>;
  @ViewChild('modalStore', { static: true }) modalStore!: TemplateRef<any>;

  @ViewChild('showAreas', { static: true }) showAreas!: TemplateRef<any>;

  private routesService = inject(RoutesService);
  private paginationService = inject(PaginationService);
  private formBuilder = inject(FormBuilder);
  private modal = inject(NgbModal);
  private toastService = inject(ToastService);
  private confirmationModalService = inject(ConfirmationModalService);

  public validatorService = inject(ValidatorService);
  public areasRoutes: any = [];
  public routes: any[] = [];
  public orderByField: string = '';
  public term: string = '';
  public orderByAsc: boolean = true;
  public selectedRoute: any | null = null;
  public isLoading = false;
  public paginateParameters: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'routes',
    params: {
      term: this.term,
      orderByAsc: this.orderByAsc,
      orderBy: this.orderByAsc,
    }
  };
  public dragData!: string;
  public formStoreRoute: FormGroup = this.formBuilder.group({
    code: ['', [Validators.required]],
  });


  public formEditRoute: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    code: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.getroutes();
    this.paginationService.pagination$.subscribe({
      next: (value) => {
        this.routes = value.data;
      },
    });
  }

  getroutes() {
    this.routesService.get(this.paginateParameters).subscribe({
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
    this.getroutes();
  }
  search(event: any) {
    this.term = event.target.value;
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      term: this.term
    };
    // this.paginateParameters.page = 1;

    this.getroutes();
  }

  handleDoubleClick(route: any) {
    this.formEditRoute.setValue({
      id: route.id,
      code: route.code,
    });
    this.modal.open(this.modalUpdate, { size: 'lg' });

  }

  selectColor(route: any) {    
    this.selectedRoute = route;
  }

  openStoreModal() {
    this.modal.open(this.modalStore, { size: 'lg' });
  }
  openAreasModal(route: any) {
    this.areasRoutes = route.areasRoutes;
    this.modal.open(this.showAreas, { size: 'lg' });
  }
  store() {
    this.isLoading = true;
    if (this.formStoreRoute.invalid) {
      this.isLoading = false;
      this.formStoreRoute.markAllAsTouched();
      return;
    }
    let formStoreRoute = this.formStoreRoute.value;
    this.routesService.store(formStoreRoute).subscribe({
      next: (resp) => {
        console.log(resp);
        this.getroutes();
        this.modal.dismissAll(this.modalUpdate);
        this.toastService.showToast({
          message: `La ruta ${resp.code} se agregó exitosamente`,
          state: 'success'
        });
        this.formStoreRoute.reset();
      },
      error(err) {

      },
    });
  }

  update() {
    this.isLoading = true;
    if (this.formEditRoute.invalid) {
      this.isLoading = false;
      this.formEditRoute.markAllAsTouched();
      return;
    }
    let formEditRoute = this.formEditRoute.value;
    if (this.selectedRoute) {
      this.routesService.update(this.selectedRoute.id, formEditRoute).subscribe({
        next: (resp) => {
          console.log(resp);
          this.getroutes();
          this.modal.dismissAll(this.modalUpdate);
          this.toastService.showToast({
            message: `La ruta ${resp.code} se actualizó exitosamente`,
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
        if (this.selectedRoute) {
          this.routesService.delete(this.selectedRoute.id).subscribe({
            next: (resp) => {
              console.log(resp);
              this.getroutes();
              this.selectedRoute = null;
              this.toastService.showToast({
                message: `La ${resp.code} se eliminó exitosamente`,
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

  onAreaDragStart(e: any) {
    console.log(e);
    this.dragData = e.target.innerText;
  }
  onAreaDragOver(e: any) {
    e.preventDefault();
  }

  onAreaDrop(e: any) {
    e.preventDefault();
    const targetArea = e.target;
    targetArea.innerText = this.dragData;
  }
}
