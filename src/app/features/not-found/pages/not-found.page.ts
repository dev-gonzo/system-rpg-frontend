
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@app/shared/services/language.service';
import { ThemeState } from '@app/design/theme/theme.state';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, TranslateModule],
  templateUrl: './not-found.page.html',
})
export class NotFoundPage {
  private readonly languageService = inject(LanguageService);
  readonly theme = inject(ThemeState);
}
