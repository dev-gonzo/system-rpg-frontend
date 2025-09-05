import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';

import { ThemeState } from '@app/design/theme/theme.state';

import {
  TranslatedFormComponent,
  TranslatedFormService,
} from '@app/core/hooks/useTranslatedForm';
import { SectionWrapperComponent } from '@app/shared/components/section-wrapper/section-wrapper.component';
import { ToastService } from '@app/shared/components/toast/toast.service';
import { ConfirmationModalComponent } from '@app/shared/components/confirmation-modal/confirmation-modal.component';
import { ConfirmationModalService } from '@app/shared/components/confirmation-modal/confirmation-modal.service';

import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';
import {
  ResponsiveTableComponent,
  TableAction,
  TableColumn,
} from '@app/shared/components/responsive-table/responsive-table.component';

import { UsersApiService } from '@app/api/users/users.api.service';
import { UserData } from '@app/api/users/users.api.types';
import { ApiErrorResponse } from '@app/core/types/errorApiForm';
import { HateoasLink } from '@app/core/types/hateoas';

@Component({
  standalone: true,
  selector: 'app-user-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SectionWrapperComponent,
    ConfirmationModalComponent,

    ResponsiveTableComponent,
    PaginationComponent,

    TranslateModule,
    MatIconModule,
  ],
  templateUrl: './user-list.page.html',
  styleUrl: './user-list.page.scss',
  providers: [TranslatedFormService],
})
export class UserListPage extends TranslatedFormComponent implements OnInit {
  private readonly cdRef = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly usersApiService = inject(UsersApiService);
  private readonly toastService = inject(ToastService);
  private readonly translate = inject(TranslateService);
  private readonly confirmationModalService = inject(ConfirmationModalService);
  readonly theme = inject(ThemeState);

  protected readonly Math = Math;

  users = signal<UserData[]>([]);
  isLoading = signal<boolean>(false);
  isSearching = signal<boolean>(false);
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);
  pageSize = signal<number>(10);
  hasSearched = signal<boolean>(false);
  paginationTranslationKey = signal<string>('PAGE.USER_LIST.PAGINATION_INFO');
  isDarkModeSignal = signal<boolean>(false);

  tableColumns: TableColumn[] = [
    {
      key: 'fullName',
      label: 'PAGE.USER_LIST.TABLE.NAME',
      mobileLabel: 'Nome',
    },
    {
      key: 'username',
      label: 'PAGE.USER_LIST.TABLE.USERNAME',
      mobileLabel: 'Usuário',
    },
    {
      key: 'email',
      label: 'PAGE.USER_LIST.TABLE.EMAIL',
      mobileLabel: 'E-mail',
    },
    {
      key: 'roleNames',
      label: 'PAGE.USER_LIST.TABLE.ROLES',
      mobileLabel: 'Perfis',
    },
    {
      key: 'statusLabel',
      label: 'PAGE.USER_LIST.TABLE.STATUS',
      mobileLabel: 'Status',
    },
    {
      key: 'formattedDate',
      label: 'PAGE.USER_LIST.TABLE.CREATED_AT',
      mobileLabel: 'Criado em',
    },
  ];

  tableActions: TableAction[] = [
    {
      label: 'Editar',
      icon: 'edit',
      action: (item: Record<string, unknown>) =>
        this.onEditUser(item as unknown as UserData),
      visible: (item: Record<string, unknown>) =>
        this.hasAction(item as unknown as UserData, 'update'),
    },
    {
      label: 'Alternar Status',
      icon: 'toggle_on',
      action: (item: Record<string, unknown>) =>
        this.onToggleStatus(item as unknown as UserData),
      visible: (item: Record<string, unknown>) =>
        this.hasAction(item as unknown as UserData, 'toggle-status'),
    },
    {
      label: 'Verificar E-mail',
      icon: 'mail',
      action: (item: Record<string, unknown>) =>
        this.onVerifyEmail(item as unknown as UserData),
      visible: (item: Record<string, unknown>) =>
        this.hasAction(item as unknown as UserData, 'verify-email') &&
        !(item as unknown as UserData).isEmailVerified,
    },
    {
      label: 'Excluir',
      icon: 'delete',
      action: (item: Record<string, unknown>) =>
        this.onDeleteUser(item as unknown as UserData),
      visible: (item: Record<string, unknown>) =>
        this.hasAction(item as unknown as UserData, 'delete'),
    },
  ];

  constructor() {
    super();

    this.isDarkModeSignal.set(this.theme.theme() === 'dark');

    effect(() => {
      this.isDarkModeSignal.set(this.theme.theme() === 'dark');
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  public async loadUsers(page: number = 0): Promise<void> {
    this.isLoading.set(true);

    try {
      const response = await firstValueFrom(this.usersApiService
        .listUsers(page, this.pageSize(), ['firstName,asc', 'createdAt,desc']));
      if (response?.data) {
        this.users.set(response.data.content);
        this.currentPage.set(response.data.page.number);
        this.totalPages.set(response.data.page.totalPages);
        this.totalElements.set(response.data.page.totalElements);
      }
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      this.toastService.danger(
        apiError.message || this.translate.instant('PAGE.USER_LIST.LOAD_ERROR'),
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  onReset(): void {
    this.hasSearched.set(false);
    this.loadUsers();
    this.cdRef.detectChanges();
  }

  hasAction(user: UserData, action: string): boolean {
    return user._links.some((link) => link.rel === action);
  }

  getActionLink(user: UserData, action: string): HateoasLink | undefined {
    return user._links.find((link) => link.rel === action);
  }

  onEditUser(user: UserData): void {
    this.performEditUser(user);
  }

  private async performEditUser(user: UserData): Promise<void> {
    const editLink = this.getActionLink(user, 'update');
    if (editLink) {
      this.router.navigate(['/users', user.id, 'edit']);
    }
  }

  onDeleteUser(user: UserData): void {
    this.performDeleteUser(user);
  }

  private async performDeleteUser(user: UserData): Promise<void> {
    const deleteLink = this.getActionLink(user, 'delete');
    if (deleteLink) {
      this.confirmationModalService.showDanger(
        this.translate.instant('PAGE.USER_LIST.ACTIONS.DELETE'),
        this.translate.instant('PAGE.USER_LIST.MESSAGES.CONFIRM_DELETE', {
          name: `${user.firstName} ${user.lastName}`,
        }),
        async () => {
          try {
            const response = await firstValueFrom(this.usersApiService.deleteUser(user.id));
            this.toastService.success(
              response?.message || this.translate.instant('PAGE.USER_LIST.DELETE_SUCCESS'),
            );

            await this.loadUsers(this.currentPage());
          } catch (error) {
            const apiError = error as ApiErrorResponse;
            this.toastService.danger(
              apiError.message ||
                this.translate.instant('PAGE.USER_LIST.DELETE_ERROR'),
            );
          }
        }
      );
    }
  }

  onToggleStatus(user: UserData): void {
    this.performToggleStatus(user);
  }

  private async performToggleStatus(user: UserData): Promise<void> {
    const toggleLink = this.getActionLink(user, 'toggle-status');
    if (toggleLink) {
      try {
        const newActiveStatus = !user.isActive;
        const response = await firstValueFrom(this.usersApiService.toggleUserStatus(user.id, newActiveStatus));
        this.toastService.success(
          response?.message || this.translate.instant('PAGE.USER_LIST.STATUS_TOGGLE_SUCCESS'),
        );

        await this.loadUsers(this.currentPage());
      } catch (error) {
        const apiError = error as ApiErrorResponse;
        this.toastService.danger(
          apiError.message ||
            this.translate.instant('PAGE.USER_LIST.STATUS_TOGGLE_ERROR'),
        );
      }
    }
  }

  onVerifyEmail(user: UserData): void {
    this.performVerifyEmail(user);
  }

  private async performVerifyEmail(user: UserData): Promise<void> {
    const verifyLink = this.getActionLink(user, 'verify-email');
    if (verifyLink) {
      try {
        await firstValueFrom(this.usersApiService.verifyUserEmail(user.id));
        this.toastService.success(
          this.translate.instant('PAGE.USER_LIST.EMAIL_VERIFY_SUCCESS'),
        );

        await this.loadUsers(this.currentPage());
      } catch (error) {
        const apiError = error as ApiErrorResponse;
        this.toastService.danger(
          apiError.message ||
            this.translate.instant('PAGE.USER_LIST.EMAIL_VERIFY_ERROR'),
        );
      }
    }
  }

  getRoleNames(user: UserData): string {
    return user.roles.map((role) => role.name).join(', ');
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  trackByUserId(index: number, item: Record<string, unknown>): unknown {
    return (item as unknown as UserData).id;
  }

  get tableData(): Record<string, unknown>[] {
    return this.users().map((user) => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
      roleNames: this.getRoleNames(user),
      statusLabel: user.isActive
        ? this.translate.instant('COMMON.ACTIVE')
        : this.translate.instant('COMMON.INACTIVE'),
      formattedDate: this.formatDate(user.createdAt),
    }));
  }

  isDarkMode(): boolean {
    return this.theme.theme() === 'dark';
  }

  onActionClick(event: { action: string; item: UserData }): void {
    const { action, item } = event;

    switch (action) {
      case 'edit':
        this.onEditUser(item);
        break;
      case 'toggle-status':
        this.onToggleStatus(item);
        break;
      case 'verify-email':
        this.onVerifyEmail(item);
        break;
      case 'delete':
        this.onDeleteUser(item);
        break;
    }
  }
}
