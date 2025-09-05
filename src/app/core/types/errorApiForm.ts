import { HttpErrorResponse } from '@angular/common/http';

export type ErrorApiForm = {
  timestamp: string;
  type: string;
  status: number;
  error: string;
  message: string;
  fieldErrors: fieldErrors[];
  path: string;
};

export type fieldErrors = {
  iid: string;
  entity: string;
  field: string;
  error: string;
};

export type ApiErrorResponse = HttpErrorResponse & {
  error: ErrorApiForm;
  message: string;
  timestamp: number;
};
