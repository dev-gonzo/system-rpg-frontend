import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as yup from 'yup';

type Schema<T extends yup.Maybe<yup.AnyObject>> = yup.ObjectSchema<T>;

interface ValidationResult<T> {
  success: boolean;
  data?: Partial<T>;
  errors?: Record<string, string>;
}

@Injectable({ providedIn: 'root' })
export class FormValidatorService {
  async validateForm<T extends yup.Maybe<yup.AnyObject>>(
    form: FormGroup,
    schema: Schema<T>,
  ): Promise<ValidationResult<T>> {
    try {
      const raw = await schema.validate(form.getRawValue(), {
        abortEarly: false,
        stripUnknown: true,
      });

      const data = raw ?? {};

      this.clearFormErrors(form);
      return { success: true, data };
    } catch (error) {
      const validationErrors = this.mapYupErrors(error);

      Object.entries(validationErrors).forEach(([field, message]) => {
        const control = form.get(field);
        if (control) {
          
          const existingErrors = control.errors || {};
          const hasCustomErrors = Object.keys(existingErrors).some(key => key !== 'message');
          
          if (hasCustomErrors) {
            
            control.setErrors({ ...existingErrors, message: message });
          } else {
            
            control.setErrors({ message: message });
          }
          
          control.markAsTouched();
          control.markAsDirty();
        }
      });

      return { success: false, errors: validationErrors };
    }
  }

  private clearFormErrors(form: FormGroup): void {
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      const errors = control?.errors;

      if (control && errors && 'message' in errors) {
        const cleaned = Object.entries(errors).reduce(
          (acc, [k, v]) => {
            if (k !== 'message') acc[k] = v;
            return acc;
          },
          {} as Record<string, unknown>,
        );

        control.setErrors(Object.keys(cleaned).length > 0 ? cleaned : null);
      }
    });
  }

  private mapYupErrors(error: unknown): Record<string, string> {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path && !errors[err.path]) {
          errors[err.path] = err.message;
        }
      });
      return errors;
    }
    return {};
  }
}
