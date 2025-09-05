import * as yup from 'yup';
import { TranslateService } from '@ngx-translate/core';

export const createGameGroupSchema = async (translate: TranslateService) => {
  await translate.get('VALIDATION.GAME_GROUP_NAME_REQUIRED').toPromise();

  return {
    essentialInfoschemaStep: yup.object({
      campaignName: yup
        .string()
        .required(translate.instant('VALIDATION.CAMPAIGN_NAME_REQUIRED'))
        .min(3, translate.instant('VALIDATION.CAMPAIGN_NAME_MIN_LENGTH'))
        .max(100, translate.instant('VALIDATION.CAMPAIGN_NAME_MAX_LENGTH')),
      shortDescription: yup
        .string()
        .required(translate.instant('VALIDATION.SHORT_DESCRIPTION_REQUIRED'))
        .min(10, translate.instant('VALIDATION.SHORT_DESCRIPTION_MIN_LENGTH'))
        .max(200, translate.instant('VALIDATION.SHORT_DESCRIPTION_MAX_LENGTH')),
      campaignOverview: yup
        .string()
        .max(1000, translate.instant('VALIDATION.CAMPAIGN_OVERVIEW_MAX_LENGTH')),
      gameSystem: yup
        .string()
        .required(translate.instant('VALIDATION.GAME_SYSTEM_REQUIRED'))
        .min(2, translate.instant('VALIDATION.GAME_SYSTEM_MIN_LENGTH'))
        .max(100, translate.instant('VALIDATION.GAME_SYSTEM_MAX_LENGTH')),
      settingWorld: yup
        .string()
        .required(translate.instant('VALIDATION.SETTING_WORLD_REQUIRED'))
        .min(2, translate.instant('VALIDATION.SETTING_WORLD_MIN_LENGTH'))
        .max(100, translate.instant('VALIDATION.SETTING_WORLD_MAX_LENGTH')),
      minPlayers: yup
        .number()
        .required(translate.instant('VALIDATION.MIN_PLAYERS_REQUIRED'))
        .min(1, translate.instant('VALIDATION.MIN_PLAYERS_MIN'))
        .max(10, translate.instant('VALIDATION.MIN_PLAYERS_MAX')),
      maxPlayers: yup
        .number()
        .required(translate.instant('VALIDATION.MAX_PLAYERS_REQUIRED'))
        .min(2, translate.instant('VALIDATION.MAX_PLAYERS_MIN'))
        .max(20, translate.instant('VALIDATION.MAX_PLAYERS_MAX')),
    }),

    accessLocationschemaStep: yup.object({
      visibilityGameGroup: yup
        .string()
        .required(translate.instant('VALIDATION.VISIBILITY_REQUIRED'))
        .oneOf(['public', 'private'], translate.instant('VALIDATION.VISIBILITY_INVALID')),
      accessRule: yup
        .string()
        .required(translate.instant('VALIDATION.ACCESS_RULE_REQUIRED'))
        .oneOf(['free', 'friends', 'approval'], translate.instant('VALIDATION.ACCESS_RULE_INVALID')),
      modality: yup
        .string()
        .required(translate.instant('VALIDATION.MODALITY_REQUIRED'))
        .oneOf(['online', 'presential'], translate.instant('VALIDATION.MODALITY_INVALID')),
      locationOrVirtualTabletop: yup
        .string()
        .required(translate.instant('VALIDATION.LOCATION_OR_VIRTUAL_REQUIRED'))
        .min(3, translate.instant('VALIDATION.LOCATION_OR_VIRTUAL_MIN_LENGTH'))
        .max(200, translate.instant('VALIDATION.LOCATION_OR_VIRTUAL_MAX_LENGTH')),
      country: yup.string().optional(),
      state: yup.string().optional(),
      city: yup.string().optional(),
    }),

    summarySchemaStep: yup.object({}),
  };
};
