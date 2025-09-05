import * as yup from 'yup';
import { TranslateService } from '@ngx-translate/core';
import { RegisterApiService } from '@app/api/users/register.api.service';
import { createEmailAvailabilityValidator } from '@app/core/validators/check-email.validator';
import { createUsernameAvailabilityValidator } from '@app/core/validators/check-username.validator';





export const createAvailabilitySchema = (translate: TranslateService, registerApiService: RegisterApiService) => {
  return yup.object({
    email: yup
      .string()
      .email(translate.instant('VALIDATION.EMAIL_INVALID'))
      .test('checkEmailAvailability', translate.instant('VALIDATION.EMAIL_UNAVAILABLE'), async function (value) {
        if (!value) return true;
        const validator = createEmailAvailabilityValidator(registerApiService);
        const result = await validator(value);
        
        if (!result.isValid) {
          return this.createError({ message: result.message ?? translate.instant('VALIDATION.EMAIL_UNAVAILABLE') });
        }
        return result.isValid;
      }),
    
    username: yup
      .string()
      .test('checkUsernameAvailability', translate.instant('VALIDATION.USERNAME_UNAVAILABLE'), async function (value) {
        if (!value) return true;
        const validator = createUsernameAvailabilityValidator(registerApiService);
        const result = await validator(value);
        
        if (!result.isValid) {
          return this.createError({ message: result.message ?? translate.instant('VALIDATION.USERNAME_UNAVAILABLE') });
        }
        return result.isValid;
      }),
  });
};



export const registerSchema = async (translate: TranslateService, registerApiService?: RegisterApiService) => {
  return yup.object({
    username: yup
      .string()
      .required(translate.instant('VALIDATION.USERNAME_REQUIRED'))
      .min(2, translate.instant('VALIDATION.USERNAME_MIN_LENGTH'))
      .max(100, translate.instant('VALIDATION.USERNAME_MAX_LENGTH'))
      .test('availability', '', async function(value) {
        if (registerApiService) {
          if (!value) return true;
          const validator = createUsernameAvailabilityValidator(registerApiService);
          const result = await validator(value);
          
          if (!result.isValid) {
            return this.createError({ message: result.message ?? translate.instant('VALIDATION.USERNAME_UNAVAILABLE') });
          }
        }
        return true;
      }),

    firstName: yup
      .string()
      .required(translate.instant('VALIDATION.FIRST_NAME_REQUIRED'))
      .min(2, translate.instant('VALIDATION.FIRST_NAME_MIN_LENGTH'))
      .max(100, translate.instant('VALIDATION.FIRST_NAME_MAX_LENGTH')),

    lastName: yup
      .string()
      .required(translate.instant('VALIDATION.LAST_NAME_REQUIRED'))
      .min(2, translate.instant('VALIDATION.LAST_NAME_MIN_LENGTH'))
      .max(100, translate.instant('VALIDATION.LAST_NAME_MAX_LENGTH')),
    
    email: yup
      .string()
      .required(translate.instant('VALIDATION.EMAIL_REQUIRED'))
      .email(translate.instant('VALIDATION.EMAIL_INVALID'))
      .max(100, translate.instant('VALIDATION.EMAIL_MAX_LENGTH'))
      .test('availability', '', async function(value) {
        if (registerApiService) {
          if (!value) return true;
          const validator = createEmailAvailabilityValidator(registerApiService);
          const result = await validator(value);
          
          if (!result.isValid) {
            return this.createError({ message: result.message ?? translate.instant('VALIDATION.EMAIL_UNAVAILABLE') });
          }
          return result.isValid;
        }
        return true;
      }),
     
     password: yup
      .string()
      .required(translate.instant('VALIDATION.PASSWORD_REQUIRED'))
      .min(8, translate.instant('VALIDATION.PASSWORD_MIN_LENGTH_REGISTER'))
      .matches(/[A-Z]/, translate.instant('VALIDATION.PASSWORD_UPPERCASE'))
      .matches(/[a-z]/, translate.instant('VALIDATION.PASSWORD_LOWERCASE'))
      .matches(/\d/, translate.instant('VALIDATION.PASSWORD_NUMBER'))
      .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, translate.instant('VALIDATION.PASSWORD_SPECIAL_CHAR')),
    
    confirmPassword: yup
      .string()
      .required(translate.instant('VALIDATION.CONFIRM_PASSWORD_REQUIRED'))
      .oneOf([yup.ref('password')], translate.instant('VALIDATION.PASSWORDS_MUST_MATCH')),
  });
};

export type RegisterFormData = yup.InferType<
  ReturnType<typeof registerSchema> extends PromiseLike<infer T> ? T : never
>;