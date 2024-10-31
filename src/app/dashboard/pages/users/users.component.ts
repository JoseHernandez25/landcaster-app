import { PaginationService } from './../../../shared/pagination/pagination.service';
import { Component, ElementRef, TemplateRef, ViewChild, computed, inject, viewChild } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PaginateParameters, Pagination } from '../../../interfaces/pagination.interface';
import { UserService } from '../../services/user.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../interfaces/models/user.interface';
import { ConfirmationModalService } from '../../../shared/services/confirmation-modal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../shared/services/toast.service';
import { ValidatorService } from '../../../services/validator.service';
import { RoleService } from '../../services/roles.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [PaginationComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export default class UsersComponent {
  public users: User[] = [];
  public orderByField: string = '';
  public validatorService = inject(ValidatorService);
  public roleId: number | string = '';
  private authService = inject(AuthService);
  private modal = inject(NgbModal);
  private toastService = inject(ToastService);
  private usersService = inject(UserService);
  public paginationService = inject(PaginationService);
  public term: string = '';
  public orderByAsc: boolean = true;
  public isLoading: boolean = false;
  private confirmationModalService = inject(ConfirmationModalService);
  public selectedUser: User | null = null;
  private formBuilder = inject(FormBuilder);
  public withTrashed: any = null;
  public controlsRoleDistributor: boolean = false;
  public controlsRoleEmployee: boolean = false;
  public roles: any[] = [];
  permission: string = "";

  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  @ViewChild('modalStore', { static: true }) modalStore!: TemplateRef<any>;
  @ViewChild('selectroleId') selectroleId!: ElementRef;
  public paginateParameters: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'users',
    params: {
      term: this.term,
      roleId: this.roleId,
      orderByAsc: this.orderByAsc,
      orderBy: this.orderByField
    }
  };

  private _roleService = inject(RoleService);

  public formStoreUsers: FormGroup = this.formBuilder.group({
    userName: ['', [Validators.required]],
    normalizedUserName: ['', [Validators.required]],
    email: ['', [Validators.required]],
    emailConfirmed: [true, [Validators.required]],
    passwordHash: ['', [Validators.required]],
    roleId: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required]],
    phoneNumberConfirmed: [true, [Validators.required]],
    twoFactorEnabled: [true, [Validators.required]],
    lockoutEnabled: [true, [Validators.required]],
    accessFailedCount: [0, [Validators.required]],
    RFC: [''],  // Campo adicional
    address: [''],   // Campo adicional
    CURP: [''],
    NSS: ['']
  });

  public formEditUsers: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    userName: ['', [Validators.required]],
    normalizedUserName: ['', [Validators.required]],
    email: ['', [Validators.required]],
    emailConfirmed: [true, [Validators.required]],
    passwordHash: ['', [Validators.required]],
    roleId: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required]],
    phoneNumberConfirmed: [true, [Validators.required]],
    twoFactorEnabled: [true, [Validators.required]],
    lockoutEnabled: [true, [Validators.required]],
    accessFailedCount: [0, [Validators.required]],
  });

  ngOnInit(): void {
    this.getUsers();
    this.getRoles();
    this.formStoreUsers.get('roleId')!.valueChanges.subscribe(roleId => {
      this.updateAdditionalControls(roleId)
      ;
    });
  }

  search(event: any) {
    this.term = event.target.value;
    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      term: this.term
    };
    this.getUsers();
  }

  checkUser(user: any, property: string) {
    user[property] = !user[property];
    console.log(user[property]);
  }

  openStoreModal() {
    this.modal.open(this.modalStore, { size: 'lg' });
  }

  updateAdditionalControls(roleId: string) {
    this.controlsRoleDistributor = roleId === "3";
    this.controlsRoleEmployee = roleId === "4";

    if (roleId !== "3" && roleId !== "4") {
        this.controlsRoleDistributor = false;
        this.controlsRoleEmployee = false;
    }
}

  getUsers() {
    this.usersService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.paginationService.pagination$.next(pagination);
        this.users = pagination.data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  orderBy(field: string) {
    if (this.orderByField === field) {
      this.orderByAsc = !this.orderByAsc;
    } else {
      this.orderByField = field;
      this.orderByAsc = true;
    }

    this.paginateParameters.params = {
      ...this.paginateParameters.params,
      orderByAsc: this.orderByAsc,
      orderBy: field
    };
    console.log(this.paginateParameters);
    this.getUsers();
  }

  handleDoubleClick(user: User) {
    console.log(user);
    this.formEditUsers.setValue({
      id: user.id,
      userName: user.userName,
      normalizedUserName : user.normalizedUserName,
      roleId: user.roleId,
      email: user.email,
      emailConfirmed: user.emailConfirmed,
      twoFactorEnabled: user.twoFactorEnabled,
      passwordHash: user.passwordHash,
      accessFailedCount: user.accessFailedCount,
      lockoutEnabled: user.lockoutEnabled,
      phoneNumber: user.phoneNumber,
      phoneNumberConfirmed: user.phoneNumberConfirmed
    });
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  selectUser(user: User) {
    this.selectedUser = user;
  }

  store() {
    this.isLoading = true;
    if (this.formStoreUsers.invalid) {
      this.isLoading = false;
      this.formStoreUsers.markAllAsTouched();
      return;
    }
    let formStoreUsers = this.formStoreUsers.value;
      this.usersService.store(formStoreUsers).subscribe({
          next: (resp) => {
              console.log(resp);
              this.getUsers();
              this.modal.dismissAll(this.modalStore);
              this.toastService.showToast({
                  message: `El usuario ${resp.userName} se agregó exitosamente`,
                  state: `success`
              });
              this.formStoreUsers.reset();
          },
          error: (err) => {
              console.log(err);
              this.isLoading = false;
          },
      });
  }

  update() {
    this.isLoading = true;
    if (this.formEditUsers.invalid) {
      this.isLoading = false;
      this.formEditUsers.markAllAsTouched();
      return;
    }
    let formEditUsers = this.formEditUsers.value;
    if (this.selectedUser) {
      this.usersService.update(this.selectedUser.id, formEditUsers).subscribe({
        next: (resp) => {
          console.log(resp);
          this.getUsers();
          this.modal.dismissAll(this.modalContent);
          this.toastService.showToast({
            message: `El usuario ${resp.userName} se actualizó exitosamente`,
            state: 'success'
          });
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
    }
  }

  delete() {
    const message = '¿Estás seguro de que deseas eliminar este registro?';
    this.confirmationModalService.openConfirmationModal(message).then(confirmed => {
      if (confirmed) {
        this.isLoading = true;
        if (this.selectedUser) {
          this.usersService.delete(this.selectedUser.id).subscribe({
            next: (resp) => {
              console.log(resp);
              this.getUsers();
              this.selectedUser = null;
              this.toastService.showToast({
                message: `El usuario ${resp.userName} se eliminó exitosamente`,
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
  getRoles() {
    this._roleService.getAll().subscribe({
      next: (roles) => {
        console.log(roles);
        this.roles = roles;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
