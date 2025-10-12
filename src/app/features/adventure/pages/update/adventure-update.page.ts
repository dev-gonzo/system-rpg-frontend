import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { InputComponent as FormInputComponent } from '@app/shared/components/form/input/input.component';
import { TextareaComponent as FormTextareaComponent } from '@app/shared/components/form/textarea/textarea.component';
import { SectionWrapperComponent } from '@app/shared/components/section-wrapper/section-wrapper.component';
import { ToastService } from '@app/shared/components/toast/toast.service';
import { AdventureApiService } from '@app/api/adventure/adventure.api.service';
import { AdventureResponse } from '@app/api/adventure/adventure.api.types';

@Component({
  standalone: true,
  selector: 'app-adventure-update',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    FormInputComponent,
    FormTextareaComponent,
    SectionWrapperComponent,
  ],
  templateUrl: './adventure-update.page.html',
})
export class AdventureUpdatePage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly toastService = inject(ToastService);
  private readonly adventureApiService = inject(AdventureApiService);

  form!: FormGroup;
  private adventureId!: string;
  private gameGroupId: string | null = null;

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    });

    this.adventureId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.adventureId) return;

    this.adventureApiService.getById(this.adventureId).subscribe({
      next: (response: AdventureResponse) => {
        const data = response.data;
        if (data) {
          this.gameGroupId = data.gameGroupId;
          this.form.patchValue({
            title: data.title,
            description: data.description,
          });
        }
      },
      error: () => {
        this.toastService.danger(this.translate.instant('COMMON.ERROR'));
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.adventureId) return;
    const data = this.form.getRawValue();

    this.adventureApiService.update(this.adventureId, data).subscribe({
      next: () => {
        this.toastService.success('Aventura atualizada com sucesso!');
        if (this.gameGroupId) {
          this.router.navigate(['/game-groups', this.gameGroupId]);
        }
      },
      error: () => {
        this.toastService.danger(this.translate.instant('COMMON.ERROR'));
      },
    });
  }

  onCancel(): void {
    if (this.gameGroupId) {
      this.router.navigate(['/game-groups', this.gameGroupId]);
    } else {
      this.router.navigate(['/home']);
    }
  }
}