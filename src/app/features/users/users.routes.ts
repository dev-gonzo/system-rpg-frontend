import { Routes } from '@angular/router';

import { LayoutMainComponent } from '../../layouts/layout-main/layout-main.component';

export const USERS_ROUTES: Routes = [
  {
    path: 'users',
    component: LayoutMainComponent,
    children: [
      {
        path: '', 
        loadComponent: () =>
          import('./pages/user-list/user-list.page').then(
            (m) => m.UserListPage,
          ),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./pages/user-edit/user-edit.page').then(
            (m) => m.UserEditPage,
          ),
      },
    ],
  },
];
