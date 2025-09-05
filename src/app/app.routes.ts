import { Routes } from '@angular/router';

import { AUTH_ROUTES } from './features/auth/auth.routes';
import { HOME_ROUTES } from './features/home/home.routes';
import { InitialNavigationGuard } from './auth/guards/initial-navigation.guard';
import { NOT_FOUND_ROUTES } from './features/not-found/not-found.routes';
import { USERS_ROUTES } from './features/users/users.routes';
import { DEMO_ROUTES } from './features/demo/demo.routes';

export const routes: Routes = [
   {
    path: '',
    canActivate: [InitialNavigationGuard],
    children: [],
  },
  ...AUTH_ROUTES,
  ...USERS_ROUTES,
  ...HOME_ROUTES,
  ...DEMO_ROUTES,
  ...NOT_FOUND_ROUTES,
  
];
