import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MarkdownComponent, provideMarkdown } from 'ngx-markdown';

import { TextareaComponent } from '../../../../shared/components/form/textarea/textarea.component';

@Component({
  standalone: true,
  selector: 'app-game-group-detail',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MarkdownComponent,
    TextareaComponent,
  ],
  providers: [provideMarkdown()],
  templateUrl: './game-group-detail.page.html',
})
export class GameGroupDetailPage {
  markdownControl = new FormControl('');
  
  get markdownContent(): string {
    return this.markdownControl.value || '';
  }
}
