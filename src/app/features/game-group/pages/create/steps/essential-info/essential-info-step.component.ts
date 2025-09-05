import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { TypedFormGroup } from '@app/core/types/forms';
import { InputComponent } from '@app/shared/components/form/input/input.component';
import { TextareaComponent } from '@app/shared/components/form/textarea/textarea.component';
import { GameGroupFormData } from '../../../../types/game-group-form.types';

@Component({
  standalone: true,
  selector: 'app-essential-info-step',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    TextareaComponent,
    TranslateModule,
  ],
  templateUrl: './essential-info-step.component.html',
})
export class EssentialInfoStepComponent {
  @Input() form!: TypedFormGroup<GameGroupFormData>;
}