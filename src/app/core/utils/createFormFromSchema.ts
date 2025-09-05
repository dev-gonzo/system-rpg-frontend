import { FormBuilder, FormGroup } from '@angular/forms';
import * as yup from 'yup';

interface YupFieldDescription {
  type: string;
  default?: unknown;
}

type YupFieldsMap = Record<string, YupFieldDescription>;

export interface FormHandler<T extends yup.Maybe<yup.AnyObject>> {
  form: FormGroup;
  submit: () => Promise<T | undefined>;
}


export function createFormFromSchema<T extends yup.Maybe<yup.AnyObject>>(
  schema: yup.ObjectSchema<T>,
  onValid: (data: T) => void,
  initialValues?: Partial<T>
): FormHandler<T> {
  const fb = new FormBuilder();
  const mergedShape: Record<string, [unknown]> = {};
  const shape = schema.describe().fields as YupFieldsMap;

  for (const key in shape) {
    const field = shape[key];
    const userValue = initialValues?.[key as keyof T];

    let defaultValue: unknown;

    if (userValue !== undefined) {
      defaultValue = userValue;
    } else {
      switch (field.type) {
        case 'number':
          defaultValue = null;
          break;
        case 'boolean':
          defaultValue = null;
          break;
        case 'array':
          defaultValue = [];
          break;
        case 'object':
          defaultValue = null;
          break;
        default:
          defaultValue = ''; 
      }
    }

    mergedShape[key] = [defaultValue];
  }

  const form = fb.group(mergedShape);

  async function submit(): Promise<T | undefined> {
    
    form.markAllAsTouched();
    
    try {
      const parsed = await schema.validate(form.value, {
        abortEarly: false,
      });

      onValid(parsed as T);
      return parsed as T;
    } catch (err: unknown) {
      if (err instanceof yup.ValidationError) {
        err.inner.forEach((e) => {
          if (e.path) {
            form.get(e.path)?.setErrors({ message: e.message });
          }
        });
      }
      return undefined;
    }
  }

  return { form, submit };
}
