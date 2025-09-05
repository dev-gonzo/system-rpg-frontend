import * as yup from 'yup';
import { TranslateService } from '@ngx-translate/core';

export const createGameGroupSchema = async (translate: TranslateService) => {
  
  await translate.get('VALIDATION.GAME_GROUP_NAME_REQUIRED').toPromise();
  
  return {
    essentialInfoschemaStep: yup.object({
      gameGroupName: yup
        .string()
        .required(translate.instant('VALIDATION.GAME_GROUP_NAME_REQUIRED'))
        .min(3, translate.instant('VALIDATION.GAME_GROUP_NAME_MIN_LENGTH'))
        .max(100, translate.instant('VALIDATION.GAME_GROUP_NAME_MAX_LENGTH')),
      nome: yup
        .string()
        .required(translate.instant('VALIDATION.NOME_REQUIRED'))
        .min(2, translate.instant('VALIDATION.NOME_MIN_LENGTH'))
        .max(50, translate.instant('VALIDATION.NOME_MAX_LENGTH')),
    }),

    accessLocationschemaStep: yup.object({
      local: yup
        .string()
        .required(translate.instant('VALIDATION.LOCAL_REQUIRED'))
        .min(5, translate.instant('VALIDATION.LOCAL_MIN_LENGTH'))
        .max(200, translate.instant('VALIDATION.LOCAL_MAX_LENGTH')),
      hora: yup
        .string()
        .required(translate.instant('VALIDATION.HORA_REQUIRED'))
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, translate.instant('VALIDATION.HORA_PATTERN')),
    }),

    summarySchemaStep: yup.object({}),
  };
};


export const essentialInfoschemaStep = yup.object({
  gameGroupName: yup
    .string()
    .required('Nome da mesa é obrigatório')
    .min(3, 'Nome da mesa deve ter pelo menos 3 caracteres')
    .max(100, 'Nome da mesa deve ter no máximo 100 caracteres'),
  nome: yup
    .string()
    .required('Seu nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
});

export const accessLocationschemaStep = yup.object({
  local: yup
    .string()
    .required('Local é obrigatório')
    .min(5, 'Local deve ter pelo menos 5 caracteres')
    .max(200, 'Local deve ter no máximo 200 caracteres'),
  hora: yup
    .string()
    .required('Horário é obrigatório')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário deve estar no formato HH:MM (ex: 14:30)'),
});

export const summarySchemaStep = yup.object({});