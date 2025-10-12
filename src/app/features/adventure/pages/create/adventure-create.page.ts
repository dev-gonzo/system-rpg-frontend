import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputComponent } from '@app/shared/components/form/input/input.component';
import { TextareaComponent } from '@app/shared/components/form/textarea/textarea.component';
import { SectionWrapperComponent } from '@app/shared/components/section-wrapper/section-wrapper.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AdventureApiService } from '@app/api/adventure/adventure.api.service';
import { ToastService } from '@app/shared/components/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ApiErrorResponse } from '@app/core/types';

@Component({
  standalone: true,
  selector: 'app-adventure-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    InputComponent,
    TextareaComponent,
    SectionWrapperComponent,
  ],
  templateUrl: './adventure-create.page.html',
  providers: [],
})
export class AdventureCreatePage implements OnInit {
  form!: FormGroup;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private adventureApiService = inject(AdventureApiService);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      }),
      description: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(10), Validators.maxLength(1000)],
      }),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const data = this.form.getRawValue();
    const gameGroupId = this.route.parent?.snapshot.paramMap.get('id') || this.route.snapshot.paramMap.get('id');
    if (!gameGroupId) return;

    (async () => {
      try {
        await firstValueFrom(this.adventureApiService.create(gameGroupId, data));
        this.toastService.success('Aventura criada com sucesso!');
        this.router.navigate(['/game-groups', gameGroupId]);
      } catch (error) {
        const apiError = error as ApiErrorResponse;
        this.toastService.danger(
          apiError?.error?.message ?? this.translate.instant('COMMON.ERROR')
        );
      }
    })();
  }
}