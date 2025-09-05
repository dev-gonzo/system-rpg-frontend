import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SectionWrapperComponent } from '@app/shared/components/section-wrapper/section-wrapper.component';
import { LanguageService } from '@app/shared/services/language.service';

@Component({
  standalone: true,
  selector: 'app-home-private',
  imports: [CommonModule, SectionWrapperComponent, TranslateModule],
  templateUrl: './home-private.page.html',
})
export class HomePrivatePage {
  private readonly languageService = inject(LanguageService);
  namePrincipa = 'aaa';


}
