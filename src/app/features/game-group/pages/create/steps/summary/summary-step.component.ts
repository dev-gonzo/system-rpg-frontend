import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { TypedFormGroup } from '@app/core/types/forms';

type GameGroupFormData = {
  gameGroupName: string;
  nome: string;
  local: string;
  hora: string;
};

@Component({
  standalone: true,
  selector: 'app-summary-step',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './summary-step.component.html',
})
export class SummaryStepComponent {
  @Input() form!: TypedFormGroup<GameGroupFormData>;
}