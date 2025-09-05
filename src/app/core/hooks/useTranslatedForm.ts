import { ChangeDetectorRef, Injectable, OnDestroy, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil, firstValueFrom, BehaviorSubject } from 'rxjs';
import * as yup from 'yup';

import { createFormFromSchema, FormStep } from '../utils/createFormFromSchema';

export interface TranslatedFormConfig<T extends yup.Maybe<yup.AnyObject>> {
  createSchema?: (translateService: TranslateService) => Promise<yup.ObjectSchema<T>>;
  createSteps?: (translateService: TranslateService) => Promise<FormStep[]>;
  onSubmit: (data: T) => void;
  initialValues?: Partial<T>;
  preserveValuesOnLanguageChange?: boolean;
}

export interface TranslatedFormResult<T extends yup.Maybe<yup.AnyObject>> {
  form: FormGroup;
  form$: BehaviorSubject<FormGroup>;
  steps?: FormStep[];
  submit: () => Promise<T | undefined>;
  destroy: () => void;
}


@Injectable()
export class TranslatedFormService {
  private readonly translateService = inject(TranslateService);
  private readonly cdRef = inject(ChangeDetectorRef);

  async createForm<T extends yup.Maybe<yup.AnyObject>>(
    config: TranslatedFormConfig<T>
  ): Promise<TranslatedFormResult<T>> {
    const destroy$ = new Subject<void>();

    const {
      createSchema,
      createSteps,
      onSubmit,
      initialValues,
      preserveValuesOnLanguageChange = true
    } = config;
    
    if (!createSchema && !createSteps) {
      throw new Error('Deve fornecer createSchema ou createSteps');
    }
    if (createSchema && createSteps) {
      throw new Error('Não é possível fornecer createSchema e createSteps ao mesmo tempo');
    }

    
    const createSchemaOrStepsWithTranslations = async () => {
      
      const currentLang = this.translateService.getCurrentLang();
      if (!currentLang) {
        const defaultLang = this.translateService.getFallbackLang() ?? 'pt-BR';
        await firstValueFrom(this.translateService.use(defaultLang));
      }
      
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (createSchema) {
        return await createSchema(this.translateService);
      } else if (createSteps) {
        return await createSteps(this.translateService);
      }
      
      throw new Error('Nenhum createSchema ou createSteps fornecido');
    };

    
    const initialSchemaOrSteps = await createSchemaOrStepsWithTranslations();
    let currentFormHandler = Array.isArray(initialSchemaOrSteps) 
      ? createFormFromSchema(initialSchemaOrSteps, onSubmit as (data: Record<string, unknown>) => void, initialValues)
      : createFormFromSchema(initialSchemaOrSteps, onSubmit, initialValues);
    
    
    const form$ = new BehaviorSubject<FormGroup>(currentFormHandler.form);
    let currentSubmit = currentFormHandler.submit;

    const destroy = () => {
      destroy$.next();
      destroy$.complete();
      form$.complete();
    };

    if (preserveValuesOnLanguageChange) {
      this.translateService.onLangChange
        .pipe(takeUntil(destroy$))
        .subscribe(async () => {
          const currentValues = currentFormHandler.form.value;
          const currentTouched: { [key: string]: boolean } = {};
          const currentErrors: { [key: string]: Record<string, unknown> | null | undefined } = {};
          
          
          Object.keys(currentFormHandler.form.controls).forEach(key => {
            const control = currentFormHandler.form.get(key);
            currentTouched[key] = control?.touched || false;
            currentErrors[key] = control?.errors;
          });
          
          const updatedSchemaOrSteps = await createSchemaOrStepsWithTranslations();
          const newFormHandler = Array.isArray(updatedSchemaOrSteps)
            ? createFormFromSchema(updatedSchemaOrSteps, onSubmit as (data: Record<string, unknown>) => void, currentValues)
            : createFormFromSchema(updatedSchemaOrSteps, onSubmit, currentValues);
          
          
          Object.keys(newFormHandler.form.controls).forEach(key => {
            const control = newFormHandler.form.get(key);
            if (control && currentTouched[key]) {
              control.markAsTouched();
              
              if (currentErrors[key]) {
                control.updateValueAndValidity();
              }
            }
          });
          
          
          const hadErrors = Object.values(currentErrors).some(error => error !== null);
          if (hadErrors) {
            
            setTimeout(() => {
              try {
          
                let validationSchema: yup.ObjectSchema<Record<string, unknown>>;
                
                if (Array.isArray(updatedSchemaOrSteps)) {
                  const mergedSchemaShape: Record<string, unknown> = {};
                  for (const step of updatedSchemaOrSteps) {
                    const stepShape = step.schema.describe().fields;
                    Object.assign(mergedSchemaShape, stepShape);
                  }
                  validationSchema = yup.object(mergedSchemaShape as yup.ObjectShape);
                } else {
                  validationSchema = updatedSchemaOrSteps as yup.ObjectSchema<Record<string, unknown>>;
                }
                
                validationSchema.validateSync(newFormHandler.form.value, { abortEarly: false });
                
                Object.keys(newFormHandler.form.controls).forEach(key => {
                  newFormHandler.form.get(key)?.setErrors(null);
                });
              } catch (err: unknown) {
                 if (err && typeof err === 'object' && 'inner' in err && Array.isArray((err as { inner: unknown[] }).inner)) {
                   (err as { inner: { path?: string; message: string }[] }).inner.forEach((e) => {
                    if (e.path) {
                      newFormHandler.form.get(e.path)?.setErrors({ message: e.message });
                    }
                  });
                }
              }
              this.cdRef.detectChanges();
            }, 0);
          }
          
          currentFormHandler = newFormHandler;
          currentSubmit = newFormHandler.submit;
          
          
          form$.next(newFormHandler.form);
          
          this.cdRef.detectChanges();
        });
    }

    return {
      get form() {
        return form$.value;
      },
      form$,
      get steps() {
        return currentFormHandler.steps;
      },
      get submit() {
        return currentSubmit as () => Promise<T | undefined>;
      },
      destroy
    };
  }
}


@Injectable()
export abstract class TranslatedFormComponent implements OnDestroy {
  protected translatedForm?: TranslatedFormResult<yup.Maybe<yup.AnyObject>>;
  protected translatedFormService = inject(TranslatedFormService);

  ngOnDestroy(): void {
    this.translatedForm?.destroy();
  }

  protected async createTranslatedForm<U extends yup.Maybe<yup.AnyObject>>(
    config: TranslatedFormConfig<U>
  ): Promise<TranslatedFormResult<U>> {
    const form = await this.translatedFormService.createForm(config);
    this.translatedForm = form as TranslatedFormResult<yup.Maybe<yup.AnyObject>>;
    return form;
  }
}