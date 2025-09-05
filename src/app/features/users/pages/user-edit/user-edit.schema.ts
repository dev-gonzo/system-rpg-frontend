import * as yup from 'yup';

export const userEditSchema = yup.object({
  username: yup
    .string()
    .required('VALIDATION.REQUIRED')
    .min(3, 'VALIDATION.MIN_LENGTH')
    .max(50, 'VALIDATION.MAX_LENGTH')
    .matches(/^[a-zA-Z0-9._-]+$/, 'VALIDATION.USERNAME_FORMAT'),
  
  email: yup
    .string()
    .required('VALIDATION.REQUIRED')
    .email('VALIDATION.EMAIL_FORMAT')
    .max(100, 'VALIDATION.MAX_LENGTH'),
  
  firstName: yup
    .string()
    .required('VALIDATION.REQUIRED')
    .min(2, 'VALIDATION.MIN_LENGTH')
    .max(50, 'VALIDATION.MAX_LENGTH')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, 'VALIDATION.NAME_FORMAT'),
  
  lastName: yup
    .string()
    .required('VALIDATION.REQUIRED')
    .min(2, 'VALIDATION.MIN_LENGTH')
    .max(50, 'VALIDATION.MAX_LENGTH')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, 'VALIDATION.NAME_FORMAT'),
  
  roles: yup
    .array()
    .of(yup.string().required())
    .min(1, 'VALIDATION.REQUIRED')
    .required('VALIDATION.REQUIRED')
});

export type UserEditFormData = yup.InferType<typeof userEditSchema>;