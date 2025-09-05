import { TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { BehaviorSubject, of, Subject } from 'rxjs';
import * as yup from 'yup';
import { TranslatedFormService, TranslatedFormComponent, TranslatedFormConfig } from './useTranslatedForm';
import { FormStep } from '../utils/createFormFromSchema';

@Injectable()
class TestTranslatedFormComponent extends TranslatedFormComponent {
  async initializeForm<T extends yup.Maybe<yup.AnyObject>>(config: TranslatedFormConfig<T>) {
    return await this.createTranslatedForm(config);
  }
}

describe('TranslatedFormService', () => {
  let service: TranslatedFormService;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;
  let changeDetectorRefSpy: jasmine.SpyObj<ChangeDetectorRef>;
  let langChangeSubject: Subject<LangChangeEvent>;

  beforeEach(() => {
    langChangeSubject = new Subject<LangChangeEvent>();
    
    const translateSpy = jasmine.createSpyObj('TranslateService', [
      'use',
      'getDefaultLang',
      'getCurrentLang',
      'getFallbackLang',
      'get',
      'instant'
    ], {
      onLangChange: langChangeSubject.asObservable()
    });
    
    translateSpy.getCurrentLang.and.returnValue('pt-BR');
    translateSpy.getDefaultLang.and.returnValue('pt-BR');
    translateSpy.getFallbackLang.and.returnValue('pt-BR');

    const cdRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    TestBed.configureTestingModule({
      providers: [
        TranslatedFormService,
        { provide: TranslateService, useValue: translateSpy },
        { provide: ChangeDetectorRef, useValue: cdRefSpy }
      ]
    });

    service = TestBed.inject(TranslatedFormService);
    translateServiceSpy = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    changeDetectorRefSpy = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
  });

  afterEach(() => {
    langChangeSubject.complete();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createForm', () => {
    let onSubmitSpy: jasmine.Spy;
    let createSchemaSpy: jasmine.Spy;
    let mockSchema: yup.ObjectSchema<{ name: string; email: string }>;

    beforeEach(() => {
      onSubmitSpy = jasmine.createSpy('onSubmit');
      mockSchema = yup.object({
        name: yup.string().required('Nome é obrigatório'),
        email: yup.string().email('Email inválido').required('Email é obrigatório')
      });
      createSchemaSpy = jasmine.createSpy('createSchema').and.returnValue(Promise.resolve(mockSchema));
    });

    it('should create form with basic configuration', async () => {
      const config = {
        createSchema: createSchemaSpy,
        onSubmit: onSubmitSpy
      };

      const result = await service.createForm(config);

      expect(result.form).toBeInstanceOf(FormGroup);
      expect(result.form$).toBeInstanceOf(BehaviorSubject);
      expect(typeof result.submit).toBe('function');
      expect(typeof result.destroy).toBe('function');
      expect(createSchemaSpy).toHaveBeenCalledWith(translateServiceSpy);
    });

    it('should create form with initial values', async () => {
      const initialValues = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const config = {
        createSchema: createSchemaSpy,
        onSubmit: onSubmitSpy,
        initialValues
      };

      const result = await service.createForm(config);

      expect(result.form.get('name')?.value).toBe('John Doe');
      expect(result.form.get('email')?.value).toBe('john@example.com');
    });

    it('should set default language when currentLang is not set', async () => {
      translateServiceSpy.getCurrentLang.and.returnValue('');
      translateServiceSpy.getFallbackLang.and.returnValue('en-US');
      translateServiceSpy.use.and.returnValue(of({}));

      const config = {
        createSchema: createSchemaSpy,
        onSubmit: onSubmitSpy
      };

      await service.createForm(config);

      expect(translateServiceSpy.use).toHaveBeenCalledWith('en-US');
    });

    it('should use pt-BR as fallback when no default language is set', async () => {
      translateServiceSpy.getCurrentLang.and.returnValue('');
      translateServiceSpy.getFallbackLang.and.returnValue(null);
      translateServiceSpy.use.and.returnValue(of({}));

      const config = {
        createSchema: createSchemaSpy,
        onSubmit: onSubmitSpy
      };

      await service.createForm(config);

      expect(translateServiceSpy.use).toHaveBeenCalledWith('pt-BR');
    });

    it('should handle form submission successfully', async () => {
      const config = {
        createSchema: createSchemaSpy,
        onSubmit: onSubmitSpy
      };

      const result = await service.createForm(config);
      
      result.form.patchValue({
        name: 'John Doe',
        email: 'john@example.com'
      });

      const submitResult = await result.submit();

      expect(onSubmitSpy).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com'
      });
      expect(submitResult).toEqual({
        name: 'John Doe',
        email: 'john@example.com'
      });
    });

    it('should handle form submission with validation errors', async () => {
      const config = {
        createSchema: createSchemaSpy,
        onSubmit: onSubmitSpy
      };

      const result = await service.createForm(config);
      
      result.form.patchValue({
        name: '',
        email: 'invalid-email'
      });

      const submitResult = await result.submit();

      expect(onSubmitSpy).not.toHaveBeenCalled();
      expect(submitResult).toBeUndefined();
      expect(result.form.get('name')?.errors).toEqual({ message: 'Nome é obrigatório' });
    });
  });

  describe('language change handling', () => {
    let onSubmitSpy: jasmine.Spy;
    let createSchemaSpy: jasmine.Spy;
    let mockSchema: yup.ObjectSchema<{ name: string; email: string }>;

    beforeEach(() => {
      onSubmitSpy = jasmine.createSpy('onSubmit');
      mockSchema = yup.object({
        name: yup.string().required('Nome é obrigatório'),
        email: yup.string().email('Email inválido').required('Email é obrigatório')
      });
      createSchemaSpy = jasmine.createSpy('createSchema').and.returnValue(Promise.resolve(mockSchema));
    });

    it('should preserve form values on language change when preserveValuesOnLanguageChange is true', async () => {
      const config = {
        createSchema: createSchemaSpy,
        onSubmit: onSubmitSpy,
        preserveValuesOnLanguageChange: true
      };

      const result = await service.createForm(config);
      
      result.form.patchValue({
        name: 'John Doe',
        email: 'john@example.com'
      });
      result.form.get('name')?.markAsTouched();

      
      const newSchema = yup.object({
        name: yup.string().required('Name is required'),
        email: yup.string().email('Invalid email').required('Email is required')
      });
      createSchemaSpy.and.returnValue(Promise.resolve(newSchema));

      langChangeSubject.next({ lang: 'en-US', translations: {} });
      
      
      await new Promise(resolve => setTimeout(resolve, 150));

      expect(result.form.get('name')?.value).toBe('John Doe');
      expect(result.form.get('email')?.value).toBe('john@example.com');
      expect(result.form.get('name')?.touched).toBeTruthy();
      expect(changeDetectorRefSpy.detectChanges).toHaveBeenCalled();
    });

    it('should not preserve form values when preserveValuesOnLanguageChange is false', async () => {
      const config = {
        createSchema: createSchemaSpy,
        onSubmit: onSubmitSpy,
        preserveValuesOnLanguageChange: false
      };

      const result = await service.createForm(config);
      
      result.form.patchValue({
        name: 'John Doe',
        email: 'john@example.com'
      });

      
      langChangeSubject.next({ lang: 'en-US', translations: {} });
      
      
      await new Promise(resolve => setTimeout(resolve, 50));

      
      expect(result.form.get('name')?.value).toBe('John Doe');
      expect(result.form.get('email')?.value).toBe('john@example.com');
    });

    it('should re-validate form with new schema on language change', async () => {
      const config = {
        createSchema: createSchemaSpy,
        onSubmit: onSubmitSpy,
        preserveValuesOnLanguageChange: true
      };

      const result = await service.createForm(config);
      
      
      result.form.patchValue({ name: '', email: 'invalid' });
      await result.submit(); 

      expect(result.form.get('name')?.errors).toEqual({ message: 'Nome é obrigatório' });

      
      const newSchema = yup.object({
        name: yup.string().required('Name is required'),
        email: yup.string().email('Invalid email').required('Email is required')
      });
      createSchemaSpy.and.returnValue(Promise.resolve(newSchema));

      langChangeSubject.next({ lang: 'en-US', translations: {} });
      
      
      await new Promise(resolve => setTimeout(resolve, 150));

      expect(result.form.get('name')?.errors).toEqual({ message: 'Name is required' });
    });

    it('should clear errors when form becomes valid after language change', async () => {
      const config = {
        createSchema: createSchemaSpy,
        onSubmit: onSubmitSpy,
        preserveValuesOnLanguageChange: true
      };

      const result = await service.createForm(config);
      
      
      result.form.patchValue({ name: '', email: 'invalid' });
      await result.submit();

      expect(result.form.get('name')?.errors).toBeTruthy();

      
      result.form.patchValue({ name: 'John', email: 'john@example.com' });

      
      langChangeSubject.next({ lang: 'en-US', translations: {} });
      
      
      await new Promise(resolve => setTimeout(resolve, 150));

      expect(result.form.get('name')?.errors).toBeNull();
      expect(result.form.get('email')?.errors).toBeNull();
    });

    it('should handle validation errors without path during language change', async () => {
      const config = {
        createSchema: createSchemaSpy,
        onSubmit: onSubmitSpy,
        preserveValuesOnLanguageChange: true
      };

      const result = await service.createForm(config);
      
      
      result.form.patchValue({ name: '', email: 'invalid' });
      await result.submit();

      
      const newSchema = yup.object({
        name: yup.string().required('Name is required')
      });
      const validationError = new yup.ValidationError('Validation failed', '', '');
      validationError.inner = [new yup.ValidationError('General error', '', '')]; 
      spyOn(newSchema, 'validateSync').and.throwError(validationError);
      createSchemaSpy.and.returnValue(Promise.resolve(newSchema));

      langChangeSubject.next({ lang: 'en-US', translations: {} });
      
      
      await new Promise(resolve => setTimeout(resolve, 150));

      
      expect(changeDetectorRefSpy.detectChanges).toHaveBeenCalled();
    });
  });

  describe('createForm with steps', () => {
    let onSubmitSpy: jasmine.Spy;
    let createStepsSpy: jasmine.Spy;
    let mockSteps: FormStep[];

    beforeEach(() => {
      onSubmitSpy = jasmine.createSpy('onSubmit');
      mockSteps = [
        {
          label: 'Step 1',
          ativo: true,
          completado: false,
          schema: yup.object({
            name: yup.string().required('Nome é obrigatório')
          })
        },
        {
          label: 'Step 2',
          ativo: false,
          completado: false,
          schema: yup.object({
            email: yup.string().email('Email inválido').required('Email é obrigatório')
          })
        }
      ];
      createStepsSpy = jasmine.createSpy('createSteps').and.returnValue(Promise.resolve(mockSteps));
    });

    it('should create form with steps configuration', async () => {
      const config = {
        createSteps: createStepsSpy,
        onSubmit: onSubmitSpy
      };

      const result = await service.createForm(config);

      expect(result.form).toBeInstanceOf(FormGroup);
      expect(result.form$).toBeInstanceOf(BehaviorSubject);
      expect(result.steps).toEqual(mockSteps);
      expect(typeof result.submit).toBe('function');
      expect(typeof result.destroy).toBe('function');
      expect(createStepsSpy).toHaveBeenCalledWith(translateServiceSpy);
    });

    it('should throw error when neither createSchema nor createSteps is provided', async () => {
      const config = {
        onSubmit: onSubmitSpy
      };

      await expectAsync(service.createForm(config as TranslatedFormConfig<Record<string, unknown>>))
        .toBeRejectedWithError('Deve fornecer createSchema ou createSteps');
    });

    it('should throw error when both createSchema and createSteps are provided', async () => {
      const mockSchema = yup.object({ name: yup.string() });
      const createSchemaSpy = jasmine.createSpy('createSchema').and.returnValue(Promise.resolve(mockSchema));
      
      const config = {
        createSchema: createSchemaSpy,
        createSteps: createStepsSpy,
        onSubmit: onSubmitSpy
      };

      await expectAsync(service.createForm(config as TranslatedFormConfig<Record<string, unknown>>))
        .toBeRejectedWithError('Não é possível fornecer createSchema e createSteps ao mesmo tempo');
    });

    it('should handle form submission with steps successfully', async () => {
      const config = {
        createSteps: createStepsSpy,
        onSubmit: onSubmitSpy
      };

      const result = await service.createForm(config);
      
      result.form.patchValue({
        name: 'John Doe',
        email: 'john@example.com'
      });

      const submitResult = await result.submit();

      expect(onSubmitSpy).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com'
      });
      expect(submitResult).toEqual({
        name: 'John Doe',
        email: 'john@example.com'
      });
    });

    it('should preserve steps and form values on language change', async () => {
      const config = {
        createSteps: createStepsSpy,
        onSubmit: onSubmitSpy,
        preserveValuesOnLanguageChange: true
      };

      const result = await service.createForm(config);
      
      result.form.patchValue({
        name: 'John Doe',
        email: 'john@example.com'
      });
      result.form.get('name')?.markAsTouched();

      
      const newSteps: FormStep[] = [
        {
          label: 'Step 1 EN',
          ativo: true,
          completado: false,
          schema: yup.object({
            name: yup.string().required('Name is required')
          })
        },
        {
          label: 'Step 2 EN',
          ativo: false,
          completado: false,
          schema: yup.object({
            email: yup.string().email('Invalid email').required('Email is required')
          })
        }
      ];
      createStepsSpy.and.returnValue(Promise.resolve(newSteps));

      langChangeSubject.next({ lang: 'en-US', translations: {} });
      
      
      await new Promise(resolve => setTimeout(resolve, 150));

      expect(result.form.get('name')?.value).toBe('John Doe');
      expect(result.form.get('email')?.value).toBe('john@example.com');
      expect(result.form.get('name')?.touched).toBeTruthy();
      expect(result.steps).toEqual(newSteps);
      expect(changeDetectorRefSpy.detectChanges).toHaveBeenCalled();
    });
  });

  describe('form$ BehaviorSubject', () => {
    it('should emit new form instance on language change', async () => {
      const onSubmitSpy = jasmine.createSpy('onSubmit');
      const mockSchema = yup.object({ name: yup.string() });
      const createSchemaSpy = jasmine.createSpy('createSchema').and.returnValue(Promise.resolve(mockSchema));

      const config = {
        createSchema: createSchemaSpy,
        onSubmit: onSubmitSpy,
        preserveValuesOnLanguageChange: true
      };

      const result = await service.createForm(config);
      const initialForm = result.form;
      
      const formEmissions: FormGroup[] = [];
      result.form$.subscribe(form => formEmissions.push(form));

      
      langChangeSubject.next({ lang: 'en-US', translations: {} });
      
      
      await new Promise(resolve => setTimeout(resolve, 150));

      expect(formEmissions.length).toBe(2); 
      expect(formEmissions[0]).toBe(initialForm);
      expect(formEmissions[1]).not.toBe(initialForm);
      expect(formEmissions[1]).toBe(result.form);
    });
  });

  describe('destroy functionality', () => {
    it('should complete observables when destroy is called', async () => {
      const onSubmitSpy = jasmine.createSpy('onSubmit');
      const mockSchema = yup.object({ name: yup.string() });
      const createSchemaSpy = jasmine.createSpy('createSchema').and.returnValue(Promise.resolve(mockSchema));

      const config = {
        createSchema: createSchemaSpy,
        onSubmit: onSubmitSpy
      };

      const result = await service.createForm(config);
      
      let completed = false;
      result.form$.subscribe({
        complete: () => completed = true
      });

      result.destroy();

      expect(completed).toBeTruthy();
    });
  });
});

describe('TranslatedFormComponent', () => {
  let component: TestTranslatedFormComponent;
  let translatedFormServiceSpy: jasmine.SpyObj<TranslatedFormService>;

  beforeEach(() => {
    const serviceSpy = jasmine.createSpyObj('TranslatedFormService', ['createForm']);

    TestBed.configureTestingModule({
      providers: [
        TestTranslatedFormComponent,
        { provide: TranslatedFormService, useValue: serviceSpy }
      ]
    });

    component = TestBed.inject(TestTranslatedFormComponent);
    translatedFormServiceSpy = TestBed.inject(TranslatedFormService) as jasmine.SpyObj<TranslatedFormService>;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should create translated form using service', async () => {
    const mockFormResult = {
      form: new FormGroup({}),
      form$: new BehaviorSubject(new FormGroup({})),
      submit: jasmine.createSpy('submit'),
      destroy: jasmine.createSpy('destroy')
    };

    translatedFormServiceSpy.createForm.and.returnValue(Promise.resolve(mockFormResult));

    const config = {
      createSchema: jasmine.createSpy('createSchema'),
      onSubmit: jasmine.createSpy('onSubmit')
    };

    const result = await component.initializeForm(config);

    expect(translatedFormServiceSpy.createForm).toHaveBeenCalledWith(config);
    expect(result).toBe(mockFormResult);
    expect((component as unknown as { translatedForm: unknown }).translatedForm).toBe(mockFormResult);
  });

  it('should destroy translated form on ngOnDestroy', () => {
    const mockFormResult = {
      form: new FormGroup({}),
      form$: new BehaviorSubject(new FormGroup({})),
      submit: jasmine.createSpy('submit'),
      destroy: jasmine.createSpy('destroy')
    };

    (component as unknown as { translatedForm: unknown }).translatedForm = mockFormResult;

    component.ngOnDestroy();

    expect(mockFormResult.destroy).toHaveBeenCalled();
  });

  it('should handle ngOnDestroy when no translated form exists', () => {
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});