import { HateoasLinks } from './hateoas';

export interface BaseResponse<T> extends HateoasLinks {
  message: string;
  timestamp: number;
  data: T;
}