import { Injectable, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import * as mdi from '@mdi/js';

@Injectable({
  providedIn: 'root',
})
export class MdiIconsService {
  private readonly matIconRegistry = inject(MatIconRegistry);
  private readonly domSanitizer = inject(DomSanitizer);

  registerIcons(): void {
    const icons: Record<string, string> = {};

    Object.entries(mdi).forEach(([key, value]) => {
      if (key.startsWith('mdi') && typeof value === 'string') {
        const kebabCase = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

        icons[kebabCase] = value;
      }
    });

    Object.entries(icons).forEach(([name, path]) => {
      this.registerIcon(name, path);
    });
  }

  registerIcon(name: string, path: string): void {
    const svgIcon = this.domSanitizer.bypassSecurityTrustHtml(
      `<svg viewBox="0 0 24 24"><path d="${path}"/></svg>`,
    );
    this.matIconRegistry.addSvgIconLiteral(name, svgIcon);
  }

  registerMultipleIcons(icons: Record<string, string>): void {
    Object.entries(icons).forEach(([name, path]) => {
      this.registerIcon(name, path);
    });
  }
}
