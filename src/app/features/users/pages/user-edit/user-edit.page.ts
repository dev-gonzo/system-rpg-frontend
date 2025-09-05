import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastService } from '@app/shared/components/toast/toast.service';
import { MatIconModule } from '@angular/material/icon';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { catchError, finalize, of } from 'rxjs';

import { FormWrapperComponent } from '../../../../shared/components/form/form-wrapper/form-wrapper.component';
import { InputComponent } from '../../../../shared/components/form/input/input.component';
import { MultiSelectComponent } from '../../../../shared/components/form/multi-select/multi-select.component';
import { SectionWrapperComponent } from '../../../../shared/components/section-wrapper/section-wrapper.component';
import { UsersApiService } from '../../../../api/users/users.api.service';
import { UserData, UserUpdateRequest, UserGetByIdResponse, UserUpdateResponse } from '../../../../api/users/users.api.types';
import { Role } from '../../../../core/types/role';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatIconModule,
    FormWrapperComponent,
    InputComponent,
    MultiSelectComponent,
    SectionWrapperComponent
  ],
  templateUrl: './user-edit.page.html',
  styleUrl: './user-edit.page.scss'
})
export class UserEditPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);
  private readonly toastr = inject(ToastService);
  private readonly usersService = inject(UsersApiService);

  
  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);
  readonly userData = signal<UserData | null>(null);
  readonly availableRoles = signal<Array<{ value: string; label: string }>>([]);

  form!: FormGroup;
  private userId!: string;

  constructor() {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      roles: [[], [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId = id;
      this.loadUser();
      this.loadRoles();
    } else {
      this.router.navigate(['/users']);
    }
  }

  private loadUser(): void {
    this.isLoading.set(true);
    
    this.usersService.getUserById(this.userId)
      .pipe(
        catchError((_error) => {
          this.toastr.danger(
            this.translate.instant('PAGE.USER_EDIT.MESSAGES.LOAD_ERROR')
          );
          this.router.navigate(['/users']);
          return of(null);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe((response: UserGetByIdResponse | null) => {
        const user = response?.data;
        if (user) {
          this.userData.set(user);
          this.populateForm(user);
        }
      });
  }

  private loadRoles(): void {
    
    const mockRoles: Role[] = [
      { 
        id: '6327a666-6568-4883-a501-e1c63b6e4a08', 
        name: 'USER', 
        description: 'Usuário comum', 
        isActive: true, 
        createdAt: '2025-08-26T10:23:45', 
        updatedAt: '2025-08-26T10:23:45' 
      },
      { 
        id: '26857d94-a694-419a-9ba6-6b96e3ab971f', 
        name: 'ADMIN', 
        description: 'Administrador do sistema', 
        isActive: true, 
        createdAt: '2025-08-26T10:23:45', 
        updatedAt: '2025-08-26T10:23:45' 
      },
      { 
        id: '3f8e9c2d-1a5b-4c7e-9f2a-8b6d4e1c3a5f', 
        name: 'MANAGER', 
        description: 'Gerente do sistema', 
        isActive: true, 
        createdAt: '2025-08-26T10:23:45', 
        updatedAt: '2025-08-26T10:23:45' 
      }
    ];
    
    const roleOptions = mockRoles.map((role: Role) => ({
      value: role.id,
      label: role.name
    }));
    this.availableRoles.set(roleOptions);
  }

  private populateForm(user: UserData): void {
    this.form.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      roles: user.roles?.map((role: Role) => role.id) || []
    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.userId) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting.set(true);
    
    const formValue = this.form.value;
    
    const roleNames = formValue.roles.map((roleId: string) => {
      const role = this.availableRoles().find(r => r.value === roleId);
      return role ? role.label : roleId;
    });
    
    const updateRequest: UserUpdateRequest = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      username: formValue.username,
      roles: roleNames
    };

    this.usersService.updateUser(this.userId, updateRequest)
      .pipe(
        catchError((_error) => {
          this.toastr.danger(
            this.translate.instant('PAGE.USER_EDIT.MESSAGES.UPDATE_ERROR')
          );
          return of(null);
        }),
        finalize(() => this.isSubmitting.set(false))
      )
      .subscribe((response: UserUpdateResponse | null) => {
        if (response) {
          this.toastr.success(
            this.translate.instant('PAGE.USER_EDIT.MESSAGES.UPDATE_SUCCESS')
          );
          this.router.navigate(['/users']);
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  formatDate(date: string | Date | null | undefined): string {
    if (!date) return '';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch {
      return '';
    }
  }


}