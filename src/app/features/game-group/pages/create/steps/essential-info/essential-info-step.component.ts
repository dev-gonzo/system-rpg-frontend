import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { TypedFormGroup } from '@app/core/types/forms';
import { InputComponent } from '@app/shared/components/form/input/input.component';

type GameGroupFormData = {
  gameGroupName: string;
  nome: string;
  local: string;
  hora: string;
};

@Component({
  standalone: true,
  selector: 'app-essential-info-step',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    TranslateModule,
  ],
  templateUrl: './essential-info-step.component.html',
})
export class EssentialInfoStepComponent {
  @Input() form!: TypedFormGroup<GameGroupFormData>;
}