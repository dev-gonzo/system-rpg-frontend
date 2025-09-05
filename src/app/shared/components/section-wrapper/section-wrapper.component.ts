import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-section-wrapper',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, TranslateModule],
  templateUrl: './section-wrapper.component.html'
})
export class SectionWrapperComponent  {
 @Input() title = '';
 @Input() showBack = false;
 @Input() backButtonText = 'COMMON.BACK';
 @Output() backClick = new EventEmitter<void>();



 onBackClick(): void {
   this.backClick.emit();
 }

}