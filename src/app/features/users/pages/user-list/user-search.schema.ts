import * as yup from 'yup';
import { TranslateService } from '@ngx-translate/core';

export const userSearchSchema = async (translate: TranslateService) => {
  return Promise.resolve(yup.object({
    username: yup
      .string()
      .optional()
      .max(100, translate.instant('VALIDATION.USERNAME_MAX_LENGTH')),

    firstName: yup
      .string()
      .optional()
      .max(100, translate.instant('VALIDATION.FIRST_NAME_MAX_LENGTH')),

    lastName: yup
      .string()
      .optional()
      .max(100, translate.instant('VALIDATION.LAST_NAME_MAX_LENGTH')),

    email: yup
      .string()
      .optional()
      .email(translate.instant('VALIDATION.EMAIL_INVALID'))
      .max(100, translate.instant('VALIDATION.EMAIL_MAX_LENGTH')),

    page: yup
      .number()
      .optional()
      .min(0, translate.instant('VALIDATION.PAGE_MIN'))
      .integer(translate.instant('VALIDATION.PAGE_INTEGER')),

    size: yup
      .number()
      .optional()
      .min(1, translate.instant('VALIDATION.SIZE_MIN'))
      .max(100, translate.instant('VALIDATION.SIZE_MAX'))
      .integer(translate.instant('VALIDATION.SIZE_INTEGER')),

    sort: yup
      .array()
      .of(yup.string())
      .optional()
  }));
};

export type UserSearchFormData = yup.InferType<yup.ObjectSchema<{
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  page?: number;
  size?: number;
  sort?: (string | undefined)[];
}>>;