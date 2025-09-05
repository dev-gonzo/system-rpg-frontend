import { Injectable, signal, OnDestroy } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollService implements OnDestroy {
  scrollY = signal(0);

  constructor() {
    if (typeof window !== 'undefined') {
      this.updateScrollPosition();
      window.addEventListener('scroll', this.onScroll, { passive: true });
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScroll);
    }
  }

  private readonly onScroll = (): void => {
    this.updateScrollPosition();
  };

  private updateScrollPosition(): void {
    if (typeof window !== 'undefined') {
      this.scrollY.set(window.scrollY);
    }
  }
}