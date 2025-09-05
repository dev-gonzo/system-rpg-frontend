import { Routes } from '@angular/router';

import { AuthGuard } from '../../auth/guards/auth.guard';
import { LayoutMainComponent } from '../../layouts/layout-main/layout-main.component';

export const HOME_ROUTES: Routes = [
  {
    path: 'home',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/private/home-private.page').then(
            (m) => m.HomePrivatePage,
          ),
      },
    ],
  },
];
