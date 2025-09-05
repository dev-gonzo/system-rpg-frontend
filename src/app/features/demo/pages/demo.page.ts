import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { FormValidatorService } from '@app/core/services/form-validation/form-validator.service';
import { TypedFormGroup } from '@app/core/types/forms';
import {
  createFormFromSchema,
} from '@app/core/utils/createFormFromSchema';
import { AutocompleteComponent } from '@app/shared/components/form/autocomplete/autocomplete.component';
import { CheckboxComponent } from '@app/shared/components/form/checkbox/checkbox.component';
import { DatepickerComponent } from '@app/shared/components/form/datepicker/datepicker.component';
import { FormWrapperComponent } from '@app/shared/components/form/form-wrapper/form-wrapper.component';
import { InputComponent } from '@app/shared/components/form/input/input.component';
import { RadioComponent } from '@app/shared/components/form/radio/radio.component';
import { SelectComponent } from '@app/shared/components/form/select/select.component';
import { MultiSelectComponent } from '@app/shared/components/form/multi-select/multi-select.component';

import { ToastService } from '@app/shared/components/toast/toast.service';

import { DemoFormData, demoSchema } from './demo.schema';
import { SectionWrapperComponent } from '@app/shared/components/section-wrapper/section-wrapper.component';
import { AlertService } from '@app/shared/components/alert/alert.service';

@Component({
  standalone: true,
  selector: 'app-demo',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormWrapperComponent,
    InputComponent,
    SelectComponent,
    MultiSelectComponent,
    CheckboxComponent,
    RadioComponent,
    AutocompleteComponent,
    DatepickerComponent,
    SectionWrapperComponent,
    MatIconModule
  ],
  templateUrl: './demo.page.html',
})
export class DemoPage implements OnInit {
  private readonly cdRef = inject(ChangeDetectorRef);
  private readonly validator = inject(FormValidatorService);

  private readonly toastService = inject(ToastService);
  private readonly alertService = inject(AlertService);

  form!: TypedFormGroup<DemoFormData>;

  
  estadosOptions = [
    { value: 'sp', label: 'São Paulo' },
    { value: 'rj', label: 'Rio de Janeiro' },
    { value: 'mg', label: 'Minas Gerais' },
    { value: 'rs', label: 'Rio Grande do Sul' },
  ];

  cidadesOptions = [
    { value: 'sao-paulo', label: 'São Paulo' },
    { value: 'rio-de-janeiro', label: 'Rio de Janeiro' },
    { value: 'belo-horizonte', label: 'Belo Horizonte' },
    { value: 'porto-alegre', label: 'Porto Alegre' },
  ];

  generoOptions = [
    { value: 'masculino', label: 'Masculino' },
    { value: 'feminino', label: 'Feminino' },
    { value: 'outro', label: 'Outro' },
    { value: 'nao-informar', label: 'Prefiro não informar' },
  ];

  experienciaOptions = [
    { value: 'iniciante', label: 'Iniciante' },
    { value: 'intermediario', label: 'Intermediário' },
    { value: 'avancado', label: 'Avançado' },
    { value: 'expert', label: 'Expert' },
  ];

  habilidadesOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'nodejs', label: 'Node.js' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
  ];

  today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  ngOnInit(): void {
    const { form } = createFormFromSchema(
      demoSchema,
      this.onSubmit.bind(this),
      {
        newsletter: false,
        aceitaTermos: false,
        habilidades: [],
      },
    );
    this.form = form;

    requestAnimationFrame(() => this.cdRef.detectChanges());
  }

  async onSubmit(): Promise<void> {
    const result = await this.validator.validateForm(this.form, demoSchema);

    if (!result.success) {
      this.form.markAllAsTouched();
      this.cdRef.detectChanges();
      return;
    }

    alert(
      'Formulário enviado com sucesso!',
    );
  }

  resetForm(): void {
    this.form.reset();
  }

  getFormErrors(): Record<string, unknown> {
    const errors: Record<string, unknown> = {};
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  get hasFormErrors(): boolean {
    return Object.keys(this.getFormErrors()).length > 0;
  }

  


  
  showSuccessAlert(): void {
    this.alertService.success('Operação realizada com sucesso!');
  }

  showDangerAlert(): void {
    this.alertService.danger('Ocorreu um erro durante a operação!');
  }

  showWarningAlert(): void {
    this.alertService.warning('Atenção: Esta ação pode ter consequências!');
  }

  showInfoAlert(): void {
    this.alertService.info('Esta é uma mensagem informativa.');
  }

  showSuccessToast(): void {
    this.toastService.success('Operação realizada com sucesso!');
  }

  showDangerToast(): void {
    this.toastService.danger('Ocorreu um erro durante a operação!');
  }

  showWarningToast(): void {
    this.toastService.warning('Atenção: Esta ação pode ter consequências!');
  }

  showInfoToast(): void {
    this.toastService.info('Esta é uma mensagem informativa.');
  }

  showNonClosableSuccessAlert(): void {
    this.alertService.success('Operação realizada com sucesso! (Não pode ser fechado)', false);
  }

  showNonClosableDangerAlert(): void {
    this.alertService.danger('Ocorreu um erro durante a operação! (Não pode ser fechado)', false);
  }

  showNonClosableWarningAlert(): void {
    this.alertService.warning('Atenção: Esta ação pode ter consequências! (Não pode ser fechado)', false);
  }

  showNonClosableInfoAlert(): void {
    this.alertService.info('Esta é uma mensagem informativa. (Não pode ser fechado)', false);
  }
}
