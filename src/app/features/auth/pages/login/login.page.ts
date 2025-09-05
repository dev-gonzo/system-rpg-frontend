import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AuthApiService } from '@app/api/auth/auth.api.service';
import { AuthService } from '@app/auth/service/auth.service';
import { TranslatedFormComponent, TranslatedFormService } from '@app/core/hooks/useTranslatedForm';
import { TypedFormGroup } from '@app/core/types/forms';
import { FormWrapperComponent } from '@app/shared/components/form/form-wrapper/form-wrapper.component';
import { InputComponent } from '@app/shared/components/form/input/input.component';

import { ApiErrorResponse } from '@app/core/types/errorApiForm';
import { ThemeState } from '@app/design/theme/theme.state';
import { AccessibilityControlsComponent } from '@app/shared/components/accessibility-controls/accessibility-controls.component';
import { ToastService } from '@app/shared/components/toast/toast.service';
import { LoginFormData, loginSchema } from './login.schema';


@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormWrapperComponent,
    InputComponent,
    AccessibilityControlsComponent,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  providers: [TranslatedFormService]
})
export class LoginPage extends TranslatedFormComponent implements OnInit {
  private readonly cdRef = inject(ChangeDetectorRef);
  private readonly authApi = inject(AuthApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly theme = inject(ThemeState);

  form!: TypedFormGroup<LoginFormData>;
  private formSubmit!: () => Promise<LoginFormData | null | undefined>;
  isSubmitting = false;

  ngOnInit(): void {
    this.initializeForm();
  }

  private async initializeForm(): Promise<void> {
    const translatedForm = await this.createTranslatedForm({
      createSchema: loginSchema,
      onSubmit: (data) => this.handleLogin(data),
      preserveValuesOnLanguageChange: true,
    });
    
    
    this.form = translatedForm.form;
    this.formSubmit = translatedForm.submit;

    
    translatedForm.form$.subscribe((newForm) => {
      this.form = newForm;
      this.formSubmit = translatedForm.submit;
      this.cdRef.detectChanges();
    });
  }

  async handleSubmit(): Promise<void> {
    
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    try {
      
      await this.formSubmit();
    } finally {
      this.isSubmitting = false;
    }
  }

  private handleLogin(data: LoginFormData): void {
    this.authApi.login(data).subscribe({
      next: (authResponse) => {
        this.auth.setAuthData(authResponse);
        this.router.navigate(['/']);
        this.toastService.success('Login efetuado!');
      },
      error: (err: ApiErrorResponse) => {
        this.toastService.danger(err.error.message ?? 'Erro no login');
      }
    });
  }

}
