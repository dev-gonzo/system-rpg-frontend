import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import {
  TranslatedFormComponent,
  TranslatedFormService,
} from '@app/core/hooks/useTranslatedForm';
import { FormValidatorService } from '@app/core/services/form-validation/form-validator.service';
import { TypedFormGroup } from '@app/core/types/forms';
import { FormStep } from '@app/core/utils/createFormFromSchema';
import { SectionWrapperComponent } from '@app/shared/components/section-wrapper/section-wrapper.component';
import { StepperNavigationComponent } from '@app/shared/components/steps/stepper-navigation/stepper-navigation.component';
import { StepperComponent } from '@app/shared/components/steps/stepper/stepper.component';
import { ToastService } from '@app/shared/components/toast/toast.service';

import { EssentialInfoStepComponent } from './steps/essential-info/essential-info-step.component';
import { LocationTimeStepComponent } from './steps/location-time/location-time-step.component';
import { RulesConductStepComponent } from './steps/summary/rules-conduct-step.component';
import { createStepsConfig } from './steps/step-config';
import { GameGroupFormData } from '../../types/game-group-form.types';

@Component({
  standalone: true,
  selector: 'app-game-group-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SectionWrapperComponent,
    StepperComponent,
    StepperNavigationComponent,
    EssentialInfoStepComponent,
    LocationTimeStepComponent,
    RulesConductStepComponent,
    TranslateModule,
  ],
  templateUrl: './game-group-create.page.html',
  providers: [TranslatedFormService],
})
export class GameGroupCreatePage extends TranslatedFormComponent implements OnInit {
  private readonly cdRef = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly translate = inject(TranslateService);
  private readonly formValidator = inject(FormValidatorService);

  form!: TypedFormGroup<GameGroupFormData>;
  private formSubmit!: () => Promise<GameGroupFormData | null | undefined>;
  
  steps: FormStep[] = [];
  stepAtual = 0;
  isSubmitting = false;

  async ngOnInit(): Promise<void> {
    const result = await this.translatedFormService.createForm({
      createSteps: (translateService: TranslateService) => createStepsConfig(translateService),
      onSubmit: this.handleCreateGameGroup.bind(this),
      preserveValuesOnLanguageChange: true,
    });

    this.form = result.form as TypedFormGroup<GameGroupFormData>;
    this.formSubmit = result.submit;
    this.steps = result.steps || [];
    
    this.cdRef.detectChanges();
  }

  async onSubmit(): Promise<void> {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    try {
      
      let isValid = true;
      for (const step of this.steps) {
        const result = await this.formValidator.validateForm(this.form, step.schema);
        if (!result.success) {
          isValid = false;
          break;
        }
      }

      if (isValid) {
        await this.formSubmit();
      } else {
        const errorMessage = this.translate.instant('PAGE.GAME_GROUP.CREATE.FORM_ERROR');
        this.toastService.danger(errorMessage);
      }
    } catch {
      const errorMessage = this.translate.instant('PAGE.GAME_GROUP.CREATE.ERROR');
      this.toastService.danger(errorMessage);
    } finally {
      this.isSubmitting = false;
    }
  }

  private async handleCreateGameGroup(_formData: GameGroupFormData): Promise<void> {
    
    
    
    const successMessage = this.translate.instant('PAGE.GAME_GROUP.CREATE.SUCCESS');
    this.toastService.success(successMessage);
    this.router.navigate(['/game-groups']);
  }

  trocarStep(index: number): void {
    this.atualizarSteps(index);
  }

  async proximo(): Promise<void> {
    const currentStep = this.steps[this.stepAtual];
    const result = await this.formValidator.validateForm(this.form, currentStep.schema);

    if (result.success) {
      this.atualizarSteps(this.stepAtual + 1);
    } else {
      const errorMessage = this.translate.instant('PAGE.GAME_GROUP.CREATE.STEP_ERROR');
      this.toastService.danger(errorMessage);
    }
  }

  voltar(): void {
    if (this.stepAtual > 0) {
      this.atualizarSteps(this.stepAtual - 1);
    }
  }

  private atualizarSteps(novoIndex: number): void {
    this.steps = this.steps.map((step, i) => ({
      ...step,
      ativo: i === novoIndex,
      completado: i < novoIndex,
    }));
    this.stepAtual = novoIndex;
    this.cdRef.detectChanges();
  }

  onReset(): void {
    this.form.reset();
    this.atualizarSteps(0);
    this.cdRef.detectChanges();
  }
}
