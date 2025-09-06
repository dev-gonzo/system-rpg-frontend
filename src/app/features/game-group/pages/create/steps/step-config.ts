import { createGameGroupSchema } from '../game-group-create.schema';
import { FormStep } from '@app/core/utils/createFormFromSchema';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

export const createStepsConfig = async (translate: TranslateService): Promise<FormStep[]> => {
  
  const translations = await firstValueFrom(translate.get([
    'PAGE.GAME_GROUP.CREATE.STEPS.ESSENTIAL_INFO',
    'PAGE.GAME_GROUP.CREATE.STEPS.LOCATION_TIME',
    'PAGE.GAME_GROUP.CREATE.STEPS.RULES_CONDUCT'
  ]));
  
  
  const schemas = await createGameGroupSchema(translate);
  
  return [
    {
      label: translations['PAGE.GAME_GROUP.CREATE.STEPS.ESSENTIAL_INFO'],
      ativo: true,
      completado: false,
      bloqueado: false,
      schema: schemas.essentialInfoschemaStep,
    },
    {
      label: translations['PAGE.GAME_GROUP.CREATE.STEPS.LOCATION_TIME'],
      ativo: false,
      completado: false,
      bloqueado: true,
      schema: schemas.accessLocationschemaStep,
    },
    {
      label: translations['PAGE.GAME_GROUP.CREATE.STEPS.RULES_CONDUCT'],
      ativo: false,
      completado: false,
      bloqueado: true,
      schema: schemas.rulesConductSchemaStep,
    },
  ];
};