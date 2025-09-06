import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { TypedFormGroup } from '@app/core/types/forms';
import { CheckboxComponent } from '@app/shared/components/form/checkbox/checkbox.component';
import { TextareaComponent } from '@app/shared/components/form/textarea/textarea.component';

import { GameGroupFormData } from '../../../../types/game-group-form.types';

@Component({
  standalone: true,
  selector: 'app-rules-conduct-step',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TextareaComponent,
    CheckboxComponent,
  ],
  templateUrl: './rules-conduct-step.component.html',
})
export class RulesConductStepComponent {
  @Input() form!: TypedFormGroup<GameGroupFormData>;
}