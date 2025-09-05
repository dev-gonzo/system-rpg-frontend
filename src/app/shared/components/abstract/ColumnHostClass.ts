import { Directive, HostBinding, Input } from '@angular/core';

type ColumnValue = number | string | null;

@Directive()
export abstract class ColumnHostClass {
  @Input() col: ColumnValue = null;
  @Input() colMd: ColumnValue = null;
  @Input() colLg: ColumnValue = null;
  @Input() colXl: ColumnValue = null;

  @HostBinding('class')
  get hostClass(): string {
    const classes: string[] = [];

    if (this.col) {
      classes.push(`col-${this.col}`);
    }

    if (this.colMd) {
      classes.push(`col-md-${this.colMd}`);
    }

    if (this.colLg) {
      classes.push(`col-lg-${this.colLg}`);
    }

    if (this.colXl) {
      classes.push(`col-xl-${this.colXl}`);
    }

    return classes.join(' ');
  }
}
