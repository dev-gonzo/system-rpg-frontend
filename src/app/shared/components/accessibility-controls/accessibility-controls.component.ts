import { Component, inject, Input, ElementRef, ViewChild, HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ThemeState } from '@app/design/theme/theme.state';
import { LanguageService, Language } from '@app/shared/services/language.service';
import { TooltipComponent } from '@app/shared/components/tooltip/tooltip.component';

@Component({
  selector: 'app-accessibility-controls',
  standalone: true,
  imports: [MatIconModule, CommonModule, TranslateModule, TooltipComponent],
  templateUrl: './accessibility-controls.component.html',
  styleUrls: ['./accessibility-controls.component.scss']
})
export class AccessibilityControlsComponent {
  @Input() buttonColor?: string;
  @Input() buttonClass?: string;
  @ViewChild('languageButton', { static: false }) languageButton?: ElementRef;
  
  theme = inject(ThemeState);
  languageService = inject(LanguageService);
  
  showLanguageDropdown = false;
  dropdownPosition = 'start';

  toggleTheme(): void {
    this.theme.toggleTheme();
  }

  increaseFont(): void {
    this.theme.adjustFontSize('increase');
  }

  decreaseFont(): void {
    this.theme.adjustFontSize('decrease');
  }

  resetFont(): void {
    this.theme.resetFontSize();
  }

  onKeyDown(event: KeyboardEvent, action: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (action === 'selectLanguage') {
        const target = event.target as HTMLElement;
        const langCode = target.getAttribute('data-lang-code') as Language;
        if (langCode) {
          this.selectLanguage(langCode);
        }
      }
    }
  }

  private resetFontSizeInternal(): void {
    this.theme.resetFontSize();
  }

  toggleLanguageDropdown(): void {
    this.showLanguageDropdown = !this.showLanguageDropdown;
    if (this.showLanguageDropdown) {
      this.calculateDropdownPosition();
    }
  }

  private calculateDropdownPosition(): void {
     if (this.languageButton) {
       const buttonRect = this.languageButton.nativeElement.getBoundingClientRect();
       const viewportWidth = window.innerWidth;
       
       
       if (buttonRect.left > viewportWidth / 2) {
         this.dropdownPosition = 'start';
       } else {
         this.dropdownPosition = 'end';
       }
     }
   }

  selectLanguage(languageCode: Language): void {
    this.languageService.setLanguage(languageCode);
    this.showLanguageDropdown = false;
  }

  closeLanguageDropdown(): void {
    this.showLanguageDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.showLanguageDropdown && this.languageButton) {
      const target = event.target as HTMLElement;
      const buttonElement = this.languageButton.nativeElement;
      const dropdownElement = buttonElement.parentElement?.querySelector('.language-dropdown');
      
      if (!buttonElement.contains(target) && !dropdownElement?.contains(target)) {
        this.showLanguageDropdown = false;
      }
    }
  }
}