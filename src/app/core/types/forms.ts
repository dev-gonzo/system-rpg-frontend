import { FormGroup, FormControl } from '@angular/forms';

export type TypedFormGroup<T> = FormGroup<{
  [K in keyof T]: FormControl<T[K] | null>;
}>;
