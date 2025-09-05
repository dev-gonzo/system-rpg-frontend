export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HateoasLink {
  href: string;
  rel: string;
  method: HttpMethod;
}

export interface HateoasLinks {
  _links: HateoasLink[];
}