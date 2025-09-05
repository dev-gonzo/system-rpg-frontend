import { FormBuilder, FormGroup } from '@angular/forms';
import * as yup from 'yup';

interface YupFieldDescription {
  type: string;
  default?: unknown;
}

type YupFieldsMap = Record<string, YupFieldDescription>;

export type FormStep = {
  label: string;
  ativo: boolean;
  completado: boolean;
  bloqueado?: boolean;
  schema: yup.ObjectSchema<Record<string, unknown>>;
};

export interface FormHandler<T extends yup.Maybe<yup.AnyObject>> {
  form: FormGroup;
  steps?: FormStep[];
  submit: () => Promise<T | undefined>;
}



export function createFormFromSchema<T extends yup.Maybe<yup.AnyObject>>(
  schema: yup.ObjectSchema<T>,
  onValid: (data: T) => void,
  initialValues?: Partial<T>
): FormHandler<T>;


export function createFormFromSchema(
  steps: FormStep[],
  onValid: (data: Record<string, unknown>) => void,
  initialValues?: Partial<Record<string, unknown>>
): FormHandler<Record<string, unknown>> & { steps: FormStep[] };


export function createFormFromSchema<T extends yup.Maybe<yup.AnyObject>>(
  schemaOrSteps: yup.ObjectSchema<T> | FormStep[],
  onValid: (data: T) => void,
  initialValues?: Partial<T>
): FormHandler<T> {
  const fb = new FormBuilder();
  const mergedShape: Record<string, [unknown]> = {};
  
  
  const isSteps = Array.isArray(schemaOrSteps);
  let schema: yup.ObjectSchema<T>;
  let steps: FormStep[] | undefined;
  
  if (isSteps) {
    steps = schemaOrSteps as FormStep[];
    
    const mergedSchemaShape: yup.ObjectShape = {};
    
    for (const step of steps) {
      const stepShape = step.schema.fields;
      Object.assign(mergedSchemaShape, stepShape);
    }
    
    schema = yup.object().shape(mergedSchemaShape) as yup.ObjectSchema<T>;
  } else {
    schema = schemaOrSteps as yup.ObjectSchema<T>;
  }
  
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

  const result: FormHandler<T> = { form, submit };
  
  if (steps) {
    (result as FormHandler<T> & { steps: FormStep[] }).steps = steps;
  }
  
  return result;
}
