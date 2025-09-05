import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

import {
  TranslatedFormComponent,
  TranslatedFormService,
} from '@app/core/hooks/useTranslatedForm';
import { TypedFormGroup } from '@app/core/types/forms';
import { ThemeState } from '@app/design/theme/theme.state';
import { AccessibilityControlsComponent } from '@app/shared/components/accessibility-controls/accessibility-controls.component';
import { FormWrapperComponent } from '@app/shared/components/form/form-wrapper/form-wrapper.component';
import { InputComponent } from '@app/shared/components/form/input/input.component';
import { PasswordComponent } from '@app/shared/components/form/password/password.component';

import { RegisterApiService } from '@app/api/users/register.api.service';
import { RegisterRequest } from '@app/api/users/register.api.types';
import { ApiErrorResponse } from '@app/core/types/errorApiForm';
import { ToastService } from '@app/shared/components/toast/toast.service';
import { RegisterFormData, registerSchema } from './register.schema';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormWrapperComponent,
    InputComponent,
    PasswordComponent,
    AccessibilityControlsComponent,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './register.page.html',
  providers: [TranslatedFormService],
})
export class RegisterPage extends TranslatedFormComponent implements OnInit {
  private readonly cdRef = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly registerApiService = inject(RegisterApiService);
  private readonly toastService = inject(ToastService);
  private readonly translate = inject(TranslateService);

  readonly theme = inject(ThemeState);

  form!: TypedFormGroup<RegisterFormData>;
  private formSubmit!: () => Promise<RegisterFormData | null | undefined>;
  isSubmitting = false;

  ngOnInit(): void {
    void this.initializeForm();
  }

  private async initializeForm(): Promise<void> {
    const translatedForm = await this.createTranslatedForm({
      createSchema: (translate: TranslateService) => registerSchema(translate, this.registerApiService),
      onSubmit: (data) => void this.handleRegister(data),
      preserveValuesOnLanguageChange: true,
    });

    this.form = translatedForm.form;
    this.formSubmit = translatedForm.submit;

    
    this.setupBlurValidation();

    translatedForm.form$.subscribe((newForm) => {
      this.form = newForm;
      this.formSubmit = translatedForm.submit;
      this.setupBlurValidation(); 
      this.cdRef.detectChanges();
    });
  }

  private setupBlurValidation(): void {
    
    const usernameControl = this.form.get('username');
    if (usernameControl) {
      usernameControl.valueChanges.subscribe(() => {
        
        usernameControl.setErrors(null);
      });
    }

    
    const emailControl = this.form.get('email');
    if (emailControl) {
      emailControl.valueChanges.subscribe(() => {
        
        emailControl.setErrors(null);
      });
    }
  }

  validateFieldOnBlur(fieldName: string): void {
    this.performFieldValidation(fieldName);
  }

  private async performFieldValidation(fieldName: string): Promise<void> {
    const control = this.form.get(fieldName);
    if (!control?.value) return;

    if (this.isEmailOrUsernameField(fieldName) && this.registerApiService) {
      await this.validateEmailOrUsername(fieldName, control);
    } else {
      await this.validateWithSchema(fieldName, control);
    }
  }

  private isEmailOrUsernameField(fieldName: string): boolean {
    return fieldName === 'email' || fieldName === 'username';
  }

  private async validateEmailOrUsername(fieldName: string, control: AbstractControl): Promise<void> {
    try {
      const validator = await this.createValidator(fieldName);
      const result = await validator(control.value);
      this.handleValidationResult(control, result);
    } catch (error: unknown) {
      this.handleValidationError(control, error);
    }
  }

  private async createValidator(fieldName: string): Promise<(value: string) => Promise<{ message?: string }>> {
    if (fieldName === 'email') {
      const { createEmailAvailabilityValidator } = await import('@app/core/validators/check-email.validator');
      return createEmailAvailabilityValidator(this.registerApiService);
    } else {
      const { createUsernameAvailabilityValidator } = await import('@app/core/validators/check-username.validator');
      return createUsernameAvailabilityValidator(this.registerApiService);
    }
  }

  private handleValidationResult(control: AbstractControl, result: { message?: string }): void {
    const currentErrors = control.errors ?? {};
    
    if (result.message) {
      currentErrors['message'] = result.message;
      control.setErrors(currentErrors);
    } else {
      delete currentErrors['message'];
      control.setErrors(Object.keys(currentErrors).length > 0 ? currentErrors : null);
    }
  }

  private async validateWithSchema(fieldName: string, control: AbstractControl): Promise<void> {
    try {
      const schema = await registerSchema(this.translate, this.registerApiService);
      const fieldData = { [fieldName]: control.value };
      
      await schema.validateAt(fieldName, fieldData);
      this.clearValidationMessage(control);
    } catch (error: unknown) {
      this.handleValidationError(control, error);
    }
  }

  private clearValidationMessage(control: AbstractControl): void {
    const currentErrors = control.errors ?? {};
    delete currentErrors['message'];
    control.setErrors(Object.keys(currentErrors).length > 0 ? currentErrors : null);
  }

  private handleValidationError(control: AbstractControl, error: unknown): void {
    const apiError = error as { error?: { message?: string } };
    const currentErrors = control.errors ?? {};
    currentErrors['message'] = apiError?.error?.message ?? 'Erro de validação';
    control.setErrors(currentErrors);
  }

  async onSubmit(): Promise<void> {
    await this.handleSubmit();
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

  private async handleRegister(formData: RegisterFormData): Promise<void> {
    const payload = this.convertPayload(formData);

    try {
      await firstValueFrom(this.registerApiService.register(payload));
      this.toastService.success(
        this.translate.instant('PAGE.REGISTER.SUCCESS'),
      );
      this.router.navigate(['/auth/login']);
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      this.toastService.danger(
        apiError.message ?? this.translate.instant('PAGE.REGISTER.ERROR'),
      );
    }
  }

  onReset(): void {
    this.form.reset();
    this.cdRef.detectChanges();
  }

  convertPayload(valuesForm: RegisterFormData): RegisterRequest {
    const newValue = valuesForm as Omit<RegisterFormData, 'confirmPassword'> & {
      confirmPassword?: string;
    };

    delete newValue.confirmPassword;

    return { ...newValue, roles: ['ADMIN'] } as RegisterRequest;
  }
}
