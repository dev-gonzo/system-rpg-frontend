import * as yup from 'yup';
import { TranslateService } from '@ngx-translate/core';

export const loginSchema = async (translate: TranslateService) => {
  return yup.object({
    username: yup
      .string()
      .required(translate.instant('VALIDATION.USERNAME_REQUIRED'))
      .min(3, translate.instant('VALIDATION.USERNAME_MIN_LENGTH'))
      .max(50, translate.instant('VALIDATION.USERNAME_MAX_LENGTH')),
    password: yup
      .string()
      .required(translate.instant('VALIDATION.PASSWORD_REQUIRED'))
      .min(6, translate.instant('VALIDATION.PASSWORD_MIN_LENGTH'))
      .max(100, translate.instant('VALIDATION.PASSWORD_MAX_LENGTH')),
  });
};

export type LoginFormData = yup.InferType<
  ReturnType<typeof loginSchema> extends PromiseLike<infer T> ? T : never
>;