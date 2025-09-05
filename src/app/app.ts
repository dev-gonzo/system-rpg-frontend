import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from './auth/service/auth.service';
import { ThemeState } from './design/theme/theme.state';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ConfirmationModalComponent } from './shared/components/confirmation-modal/confirmation-modal.component';
import { LanguageService } from './shared/services/language.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, ConfirmationModalComponent, TranslateModule],
  template: `
    <router-outlet></router-outlet>
    <app-toast />
    <app-confirmation-modal />
  `,
})
export class AppComponent implements OnInit {
  private readonly _theme = inject(ThemeState);
  private readonly _authService = inject(AuthService);
  private readonly _languageService = inject(LanguageService);


  ngOnInit(): void {
    this.initializeApp().then();
  }

  private async initializeApp(): Promise<void> {
    
    await new Promise(resolve => {
      if (this._languageService.language()) {
        resolve(true);
      } else {
        
        setTimeout(() => resolve(true), 500);
      }
    });
    
    await this._authService.initialize();
    this._authService.initializeTokenCheck();
  }
}
