import { CommonModule } from '@angular/common';
import { Component, Input, HostBinding, HostListener } from '@angular/core';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss'
})
export class TooltipComponent {
  @Input() text = '';
  @Input() position: TooltipPosition = 'top';
  @Input() disabled = false;
  @Input() delay = 500; 

  isVisible = false;
  private timeoutId?: number;

  @HostBinding('class') get hostClasses() {
    return `tooltip-wrapper tooltip-${this.position}`;
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.disabled || !this.text.trim()) return;
    
    this.timeoutId = window.setTimeout(() => {
      this.isVisible = true;
    }, this.delay);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
    this.isVisible = false;
  }

  @HostListener('focus')
  onFocus() {
    if (this.disabled || !this.text.trim()) return;
    this.isVisible = true;
  }

  @HostListener('blur')
  onBlur() {
    this.isVisible = false;
  }
}