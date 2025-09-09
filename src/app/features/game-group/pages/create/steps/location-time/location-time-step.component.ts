import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { TypedFormGroup } from '@app/core/types/forms';

import { InputComponent } from '@app/shared/components/form/input/input.component';
import { RadioComponent } from '@app/shared/components/form/radio/radio.component';
import { SelectComponent } from '@app/shared/components/form/select/select.component';
import { GameGroupFormData } from '../../../../types/game-group-form.types';

@Component({
  standalone: true,
  selector: 'app-location-time-step',
  imports: [
    CommonModule,
    ReactiveFormsModule,

    InputComponent,
    RadioComponent,
    SelectComponent,
    TranslateModule,
  ],
  templateUrl: './location-time-step.component.html',
})
export class LocationTimeStepComponent implements OnInit, OnDestroy {
  private readonly translate = inject(TranslateService);
  private readonly destroy$ = new Subject<void>();
  
  @Input() form!: TypedFormGroup<GameGroupFormData>;

  
  visibilityOptions = [
    { label: this.translate.instant('COMMON.VISIBILITY.PUBLIC'), value: 'public' },
    { label: this.translate.instant('COMMON.VISIBILITY.PRIVATE'), value: 'private' }
  ];

  accessRuleOptions = [
    { label: this.translate.instant('COMMON.ACCESS_RULE.FREE'), value: 'free' },
    { label: this.translate.instant('COMMON.ACCESS_RULE.FRIENDS'), value: 'friends' },
    { label: this.translate.instant('COMMON.ACCESS_RULE.APPROVAL'), value: 'approval' }
  ];

  modalityOptions = [
    { label: this.translate.instant('COMMON.MODALITY.ONLINE'), value: 'online' },
    { label: this.translate.instant('COMMON.MODALITY.PRESENCIAL'), value: 'presential' }
  ];

  
  locationOrVirtualLabel = 'PAGE.GAME_GROUP.CREATE.FIELDS.LOCATION';
  locationOrVirtualPlaceholder = 'PAGE.GAME_GROUP.CREATE.FIELDS.LOCATION_PLACEHOLDER';

  ngOnInit(): void {
    
    this.form.get('modality')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(modalityValue => {
        this.updateLocationLabels(modalityValue || '');
      });

    
    const currentModality = this.form.get('modality')?.value;
    this.updateLocationLabels(currentModality || '');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateLocationLabels(modalityValue: string): void {
    if (modalityValue === 'online') {
      this.locationOrVirtualLabel = 'PAGE.GAME_GROUP.CREATE.FIELDS.VIRTUAL_TABLETOP';
      this.locationOrVirtualPlaceholder = 'PAGE.GAME_GROUP.CREATE.FIELDS.VIRTUAL_TABLETOP_PLACEHOLDER';
    } else {
      this.locationOrVirtualLabel = 'PAGE.GAME_GROUP.CREATE.FIELDS.LOCATION';
      this.locationOrVirtualPlaceholder = 'PAGE.GAME_GROUP.CREATE.FIELDS.LOCATION_PLACEHOLDER';
    }
  }
}